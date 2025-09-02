import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { rateLimit, verifyAdmin, createAuthResponse, validators, sanitizeInput } from '@/lib/auth-middleware';

// PUT /api/products/[id]/inventory - Update product inventory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(30, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Admin authentication required for inventory updates
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { id } = await params;
    
    // Validate product ID
    const idError = validators.required(id, 'Product ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }

    const body = await request.json();
    const { size, color, quantity } = body;
    
    // Validate required fields
    const sizeError = validators.required(size, 'Size');
    const colorError = validators.required(color, 'Color');
    
    if (sizeError || colorError || quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: sizeError || colorError || 'Quantity is required' },
        { status: 400 }
      );
    }
    
    // Sanitize and validate inputs
    const sanitizedSize = sanitizeInput(size);
    const sanitizedColor = sanitizeInput(color);
    
    if (!sanitizedSize || sanitizedSize.length > 20) {
      return NextResponse.json(
        { error: 'Size must be a valid string with maximum 20 characters' },
        { status: 400 }
      );
    }
    
    if (!sanitizedColor || sanitizedColor.length > 20) {
      return NextResponse.json(
        { error: 'Color must be a valid string with maximum 20 characters' },
        { status: 400 }
      );
    }
    
    // Validate quantity
    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum < 0 || quantityNum > 10000) {
      return NextResponse.json(
        { error: 'Quantity must be a number between 0 and 10000' },
        { status: 400 }
      );
    }

    const result = await ProductService.updateInventory(id, sanitizedSize, sanitizedColor, quantityNum);
    
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