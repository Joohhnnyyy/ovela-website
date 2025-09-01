import { NextRequest, NextResponse } from 'next/server';
import { CartService } from '@/services/cartService';

// GET /api/cart/[userId] - Get user's cart
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { productId, quantity, size, color } = await request.json();
    
    // Validate required fields
    if (!productId || !quantity || !size || !color) {
      return NextResponse.json(
        { error: 'Product ID, quantity, size, and color are required' },
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
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
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