import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';
import { 
  verifyAuth, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/purchases/track - Search purchase by tracking number
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Authentication required
    const authResult = await verifyAuth(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    const rawTrackingNumber = searchParams.get('trackingNumber');
    const trackingNumber = sanitizeInput(rawTrackingNumber);
    
    // Validate tracking number
    const trackingError = validators.required(trackingNumber, 'Tracking number');
    if (trackingError) {
      return NextResponse.json({ error: trackingError }, { status: 400 });
    }
    
    // Additional validation for tracking number format
    if (typeof trackingNumber !== 'string' || trackingNumber.length < 5) {
      return NextResponse.json(
        { error: 'Tracking number must be at least 5 characters long' },
        { status: 400 }
      );
    }
    
    const result = await PurchaseService.searchByTrackingNumber(trackingNumber);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'No purchase found with this tracking number' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/purchases/track:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}