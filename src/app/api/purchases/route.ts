import { NextRequest, NextResponse } from 'next/server';
import { PurchaseService } from '@/services/purchaseService';
import { PurchaseFilters, Address, PaymentMethod } from '@/types/database';
import { 
  verifyAuth, 
  verifyAdmin, 
  verifyUserAccess, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/purchases - Get all purchases (admin) or user purchases
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Determine if this is an admin request (no userId) or user request
    if (!userId) {
      // Admin endpoint - verify admin access
      const authResult = await verifyAdmin(request);
      if (authResult.error) {
        return createAuthResponse(authResult.error);
      }
    } else {
      // User endpoint - verify user access
      const authResult = await verifyUserAccess(request, userId);
      if (authResult.error) {
        return createAuthResponse(authResult.error);
      }
    }
    
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    // Parse and sanitize filter parameters
    const filters: PurchaseFilters = {};
    
    const status = searchParams.get('status');
    if (status) {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (validStatuses.includes(status)) {
        filters.status = status as any;
      }
    }
    
    const startDateStr = searchParams.get('startDate');
    if (startDateStr) {
      const startDate = new Date(startDateStr);
      if (!isNaN(startDate.getTime())) {
        filters.startDate = startDate;
      }
    }
    
    const endDateStr = searchParams.get('endDate');
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      if (!isNaN(endDate.getTime())) {
        filters.endDate = endDate;
      }
    }
    
    const minTotalStr = searchParams.get('minTotal');
    if (minTotalStr) {
      const minTotal = parseFloat(minTotalStr);
      if (!isNaN(minTotal) && minTotal >= 0) {
        filters.minTotal = minTotal;
      }
    }
    
    const maxTotalStr = searchParams.get('maxTotal');
    if (maxTotalStr) {
      const maxTotal = parseFloat(maxTotalStr);
      if (!isNaN(maxTotal) && maxTotal >= 0) {
        filters.maxTotal = maxTotal;
      }
    }
    
    let result;
    if (userId) {
      result = await PurchaseService.getUserPurchases(userId, filters, page, limit);
    } else {
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
    // Apply rate limiting for purchase creation
    const rateLimitResult = rateLimit(10, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const rawBody = await request.json();
    const sanitizedBody = sanitizeInput(rawBody);
    
    const { 
      userId, 
      shippingAddress, 
      billingAddress, 
      paymentMethod, 
      notes 
    } = sanitizedBody;
    
    // Verify user authentication and access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }
    
    // Comprehensive input validation
    const validationErrors: string[] = [];
    
    // Validate required fields
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) validationErrors.push(userIdError);
    
    if (!shippingAddress) {
      validationErrors.push('Shipping address is required');
    } else {
      // Validate shipping address fields
      const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
      for (const field of requiredAddressFields) {
        const error = validators.required(shippingAddress[field], `Shipping ${field}`);
        if (error) validationErrors.push(error);
      }
    }
    
    if (!billingAddress) {
      validationErrors.push('Billing address is required');
    } else {
      // Validate billing address fields
      const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
      for (const field of requiredAddressFields) {
        const error = validators.required(billingAddress[field], `Billing ${field}`);
        if (error) validationErrors.push(error);
      }
    }
    
    if (!paymentMethod) {
      validationErrors.push('Payment method is required');
    } else {
      const typeError = validators.required(paymentMethod.type, 'Payment method type');
      if (typeError) validationErrors.push(typeError);
      
      const validPaymentTypes = ['credit_card', 'debit_card', 'paypal', 'stripe'];
      if (paymentMethod.type && !validPaymentTypes.includes(paymentMethod.type)) {
        validationErrors.push('Invalid payment method type');
      }
    }
    
    // Validate notes length if provided
    if (notes && typeof notes === 'string' && notes.length > 500) {
      validationErrors.push('Notes must be less than 500 characters');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
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