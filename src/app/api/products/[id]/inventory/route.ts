import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';

// PUT /api/products/[id]/inventory - Update product inventory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { size, color, quantity } = await request.json();
    
    // Validate required fields
    if (!size || !color || quantity === undefined) {
      return NextResponse.json(
        { error: 'Size, color, and quantity are required' },
        { status: 400 }
      );
    }

    const result = await ProductService.updateInventory(id, size, color, quantity);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Product not found' ? 404 : 400 }
      );
    }

    return NextResponse.json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/products/[id]/inventory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}