import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term (q) is required' },
        { status: 400 }
      );
    }
    
    const result = await ProductService.searchProducts(searchTerm, limit);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/products/search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}