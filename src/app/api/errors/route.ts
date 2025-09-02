import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, verifyAuth } from '@/lib/auth-middleware';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitCheck = rateLimit();
    const rateLimitResult = rateLimitCheck(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'log': {
        const {
          errorType,
          errorMessage,
          errorStack,
          userId,
          sessionId,
          url,
          userAgent,
          severity = 'medium',
          context = {}
        } = data;

        const { data: result, error } = await supabase.rpc('log_error', {
          p_error_type: errorType,
          p_error_message: errorMessage,
          p_error_stack: errorStack,
          p_user_id: userId,
          p_session_id: sessionId,
          p_url: url,
          p_user_agent: userAgent,
          p_severity: severity,
          p_context: context
        });

        if (error) {
          console.error('Error logging failed:', error);
          return NextResponse.json(
            { error: 'Failed to log error' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true, errorId: result });
      }

      case 'resolve': {
        // Verify authentication for resolve action
        const authResult = await verifyAuth(request);
        if (authResult.error) {
          return NextResponse.json(
            { error: authResult.error },
            { status: 401 }
          );
        }

        const { errorId } = data;
        const { error } = await supabase.rpc('resolve_error', {
          error_id: errorId
        });

        if (error) {
          console.error('Error resolution failed:', error);
          return NextResponse.json(
            { error: 'Failed to resolve error' },
            { status: 500 }
          );
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const rateLimitCheck = rateLimit();
    const rateLimitResult = rateLimitCheck(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const since = searchParams.get('since');
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    switch (action) {
      case 'metrics': {
        const { data: errors, error } = await supabase.rpc('get_error_metrics', {
          since_timestamp: sinceDate.toISOString()
        });

        if (error) {
          console.error('Error metrics fetch failed:', error);
          return NextResponse.json(
            { error: 'Failed to fetch error metrics' },
            { status: 500 }
          );
        }

        const errorList = errors || [];
        const total = errorList.length;
        const byType = errorList.reduce((acc: Record<string, number>, err: any) => {
          acc[err.error_type] = (acc[err.error_type] || 0) + 1;
          return acc;
        }, {});
        const bySeverity = errorList.reduce((acc: Record<string, number>, err: any) => {
          acc[err.severity] = (acc[err.severity] || 0) + 1;
          return acc;
        }, {});
        const resolved = errorList.filter((err: any) => err.resolved).length;
        const unresolved = total - resolved;

        return NextResponse.json({
          total,
          byType,
          bySeverity,
          resolved,
          unresolved,
          timeRange: {
            start: sinceDate,
            end: new Date()
          }
        });
      }

      case 'statistics': {
        const { data: stats, error } = await supabase.rpc('get_error_statistics', {
          since_timestamp: sinceDate.toISOString()
        });

        if (error) {
          console.error('Error statistics fetch failed:', error);
          return NextResponse.json(
            { error: 'Failed to fetch error statistics' },
            { status: 500 }
          );
        }

        return NextResponse.json(stats);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}