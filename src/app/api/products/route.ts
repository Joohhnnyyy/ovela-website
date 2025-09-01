import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { ProductData, ProductFilters } from '@/types/database';

// GET /api/products - Get products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Parse filter parameters
    const filters: ProductFilters = {};
    
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!;
    }
    
    if (searchParams.get('brand')) {
      filters.brand = searchParams.get('brand')!;
    }
    
    if (searchParams.get('minPrice')) {
      filters.minPrice = parseFloat(searchParams.get('minPrice')!);
    }
    
    if (searchParams.get('maxPrice')) {
      filters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    }
    
    if (searchParams.get('isFeatured')) {
      filters.isFeatured = searchParams.get('isFeatured') === 'true';
    }
    
    if (searchParams.get('isActive')) {
      filters.isActive = searchParams.get('isActive') === 'true';
    }
    
    if (searchParams.get('sizes')) {
      filters.sizes = searchParams.get('sizes')!.split(',');
    }
    
    if (searchParams.get('colors')) {
      filters.colors = searchParams.get('colors')!.split(',');
    }
    
    if (searchParams.get('tags')) {
      filters.tags = searchParams.get('tags')!.split(',');
    }
    
    // Handle search query
    const searchQuery = searchParams.get('search');
    
    let result;
    if (searchQuery) {
      result = await ProductService.searchProducts(searchQuery, limit);
    } else {
      result = await ProductService.getProducts(filters, page, limit);
    }
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const productData: ProductData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const result = await ProductService.createProduct(productData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}