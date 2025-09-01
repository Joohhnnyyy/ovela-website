import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';
import { PurchaseFilters, Address, PaymentMethod } from '@/types/database';

// GET /api/purchases - Get all purchases (admin) or user purchases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Parse filter parameters
    const filters: PurchaseFilters = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as any;
    }
    
    if (searchParams.get('startDate')) {
      filters.startDate = new Date(searchParams.get('startDate')!);
    }
    
    if (searchParams.get('endDate')) {
      filters.endDate = new Date(searchParams.get('endDate')!);
    }
    
    if (searchParams.get('minTotal')) {
      filters.minTotal = parseFloat(searchParams.get('minTotal')!);
    }
    
    if (searchParams.get('maxTotal')) {
      filters.maxTotal = parseFloat(searchParams.get('maxTotal')!);
    }
    
    // Check if this is a user-specific request
    const userId = searchParams.get('userId');
    
    let result;
    if (userId) {
      result = await PurchaseService.getUserPurchases(userId, filters, page, limit);
    } else {
      // Admin endpoint - get all purchases
      result = await PurchaseService.getAllPurchases(filters, page, limit);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/purchases - Create a new purchase from cart
export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      notes 
    } = await request.json();
    
    // Validate required fields
    if (!userId || !shippingAddress || !billingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'User ID, shipping address, billing address, and payment method are required' },
        { status: 400 }
      );
    }

    const result = await PurchaseService.createPurchaseFromCart(
      userId,
      shippingAddress as Address,
      billingAddress as Address,
      paymentMethod as PaymentMethod,
      notes
    );
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/purchases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}