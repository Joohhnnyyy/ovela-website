import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import { rateLimit, verifyUserAccess, createAuthResponse, validators, sanitizeInput } from '@/lib/auth-middleware';

// PUT /api/cart/[userId]/items - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    const { userId } = await params;
    
    // Validate user ID
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) {
      return NextResponse.json({ error: userIdError }, { status: 400 });
    }
    
    // Verify user access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const body = await request.json();
    const { productId, size, color, quantity } = body;
    
    // Validate required fields
    const productIdError = validators.required(productId, 'Product ID');
    const sizeError = validators.required(size, 'Size');
    const colorError = validators.required(color, 'Color');
    
    if (productIdError || sizeError || colorError || quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: productIdError || sizeError || colorError || 'Quantity is required' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate inputs
    const sanitizedProductId = sanitizeInput(productId);
    const sanitizedSize = sanitizeInput(size);
    const sanitizedColor = sanitizeInput(color);
    
    if (!sanitizedProductId || !sanitizedSize || !sanitizedColor) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }
    
    // Validate quantity
    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 0 || quantityNum > 100) {
      return NextResponse.json(
        { error: 'Quantity must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const result = await CartService.updateCartItem(userId, sanitizedProductId, sanitizedSize, sanitizedColor, quantityNum);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in PUT /api/cart/[userId]/items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[userId]/items - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    const { userId } = await params;
    
    // Validate user ID
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) {
      return NextResponse.json({ error: userIdError }, { status: 400 });
    }
    
    // Verify user access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    
    // Validate required fields
    const productIdError = validators.required(productId, 'Product ID');
    const sizeError = validators.required(size, 'Size');
    const colorError = validators.required(color, 'Color');
    
    if (productIdError || sizeError || colorError) {
      return NextResponse.json(
        { error: productIdError || sizeError || colorError },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedProductId = sanitizeInput(productId!);
    const sanitizedSize = sanitizeInput(size!);
    const sanitizedColor = sanitizeInput(color!);
    
    if (!sanitizedProductId || !sanitizedSize || !sanitizedColor) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const result = await CartService.removeFromCart(userId, sanitizedProductId, sanitizedSize, sanitizedColor);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/cart/[userId]/items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}