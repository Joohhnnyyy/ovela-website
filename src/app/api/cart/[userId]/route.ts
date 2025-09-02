import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';
import { 
  verifyUserAccess, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/cart/[userId] - Get user's cart
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(100, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const { userId } = await params;
    
    // Validate userId
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) {
      return NextResponse.json(
        { error: userIdError },
        { status: 400 }
      );
    }
    
    // Verify user access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }
    
    const result = await CartService.getUserCart(userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/cart/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart/[userId] - Add item to cart
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const { userId } = await params;
    
    // Verify user access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }
    
    const rawBody = await request.json();
    const sanitizedBody = sanitizeInput(rawBody);
    const { productId, quantity, size, color } = sanitizedBody;
    
    // Comprehensive input validation
    const validationErrors: string[] = [];
    
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) validationErrors.push(userIdError);
    
    const productIdError = validators.required(productId, 'Product ID');
    if (productIdError) validationErrors.push(productIdError);
    
    const quantityError = validators.positiveNumber(quantity, 'Quantity');
    if (quantityError) validationErrors.push(quantityError);
    
    // Validate quantity range
    if (quantity && (quantity < 1 || quantity > 99)) {
      validationErrors.push('Quantity must be between 1 and 99');
    }
    
    const sizeError = validators.required(size, 'Size');
    if (sizeError) validationErrors.push(sizeError);
    
    const colorError = validators.required(color, 'Color');
    if (colorError) validationErrors.push(colorError);
    
    // Validate size and color values
    const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    if (size && !validSizes.includes(size)) {
      validationErrors.push('Invalid size. Must be one of: ' + validSizes.join(', '));
    }
    
    if (color && typeof color === 'string' && color.length > 50) {
      validationErrors.push('Color name must be less than 50 characters');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const result = await CartService.addToCart(userId, productId, quantity, size, color);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/cart/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[userId] - Clear cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(20, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const { userId } = await params;
    
    // Validate userId
    const userIdError = validators.required(userId, 'User ID');
    if (userIdError) {
      return NextResponse.json(
        { error: userIdError },
        { status: 400 }
      );
    }
    
    // Verify user access
    const authResult = await verifyUserAccess(request, userId);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }
    
    const result = await CartService.clearCart(userId);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/cart/[userId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}