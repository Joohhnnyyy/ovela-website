import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';
import { PurchaseStatus } from '@/types/database';
import { 
  verifyAuth, 
  verifyAdmin, 
  verifyUserAccess, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/purchases/[id] - Get purchase by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(100, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Authentication required
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { id } = await params;
    
    // Validate purchase ID
    const idError = validators.required(id, 'Purchase ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }
    
    const result = await PurchaseService.getPurchaseById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Purchase not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/purchases/[id] - Update purchase status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(30, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Admin authentication required for status updates
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { id } = await params;
    
    // Validate purchase ID
    const idError = validators.required(id, 'Purchase ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    const rawData = await request.json();
    const { status, trackingNumber } = sanitizeInput(rawData);
    
    // Validate required fields
    const statusError = validators.required(status, 'Status');
    if (statusError) {
      return NextResponse.json({ error: statusError }, { status: 400 });
    }
    
    // Validate status value
    const validStatuses: PurchaseStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate tracking number if provided
    if (trackingNumber && (typeof trackingNumber !== 'string' || trackingNumber.length < 5)) {
      return NextResponse.json(
        { error: 'Tracking number must be at least 5 characters long' },
        { status: 400 }
      );
    }

    const result = await PurchaseService.updatePurchaseStatus(
      id,
      status as PurchaseStatus,
      trackingNumber
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Purchase not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in PUT /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/purchases/[id] - Cancel purchase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(20, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Admin authentication required for cancellation
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { id } = await params;
    
    // Validate purchase ID
    const idError = validators.required(id, 'Purchase ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const rawReason = searchParams.get('reason');
    const reason = sanitizeInput(rawReason);
    
    // Validate reason if provided
    if (reason && (typeof reason !== 'string' || reason.length > 500)) {
      return NextResponse.json(
        { error: 'Cancellation reason must be a string with maximum 500 characters' },
        { status: 400 }
      );
    }
    
    const result = await PurchaseService.cancelPurchase(id, reason || undefined);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Purchase not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in DELETE /api/purchases/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}