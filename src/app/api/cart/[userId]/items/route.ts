import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';

// PUT /api/cart/[userId]/items - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { productId, size, color, quantity } = await request.json();
    
    // Validate required fields
    if (!productId || !size || !color || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID, size, color, and quantity are required' },
        { status: 400 }
      );
    }

    const result = await CartService.updateCartItem(userId, productId, size, color, quantity);
    
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
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    
    // Validate required fields
    if (!productId || !size || !color) {
      return NextResponse.json(
        { error: 'Product ID, size, and color are required as query parameters' },
        { status: 400 }
      );
    }

    const result = await CartService.removeFromCart(userId, productId, size, color);
    
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