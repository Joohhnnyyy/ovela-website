import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';

// GET /api/purchases/stats - Get purchase statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
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