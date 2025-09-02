import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { rateLimit, validators, sanitizeInput } from '@/lib/auth-middleware';

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error || 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawSearchTerm = searchParams.get('q');
    const rawLimit = searchParams.get('limit');
    
    // Validate search term
    const searchTermError = validators.required(rawSearchTerm, 'Search term');
    if (searchTermError) {
      return NextResponse.json({ error: searchTermError }, { status: 400 });
    }
    
    const searchTerm = sanitizeInput(rawSearchTerm);
    if (!searchTerm || searchTerm.length < 2 || searchTerm.length > 100) {
      return NextResponse.json(
        { error: 'Search term must be between 2 and 100 characters' },
        { status: 400 }
      );
    }
    
    const limit = rawLimit ? parseInt(sanitizeInput(rawLimit) || '20') : 20;
    
    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 50' },
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