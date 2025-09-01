import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';

// GET /api/purchases/track - Search purchase by tracking number
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
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