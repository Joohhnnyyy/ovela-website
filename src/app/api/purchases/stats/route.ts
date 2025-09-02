import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';
import { 
  verifyAuth, 
  verifyAdmin, 
  verifyUserAccess, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/purchases/stats - Get purchase statistics
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(100, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Authentication and authorization
    if (userId) {
      // User requesting their own stats - verify user access
      const authResult = await verifyUserAccess(request, userId);
      if (authResult.error) {
        return createAuthResponse(authResult.error);
      }
    } else {
      // Requesting all stats - admin only
      const authResult = await verifyAdmin(request);
      if (authResult.error) {
        return createAuthResponse(authResult.error);
      }
    }
    
    // Validate userId if provided
    if (userId) {
      const userIdError = validators.required(userId, 'User ID');
      if (userIdError) {
        return NextResponse.json({ error: userIdError }, { status: 400 });
      }
    }
    
    const result = await PurchaseService.getPurchaseStats(userId || undefined);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/purchases/stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}