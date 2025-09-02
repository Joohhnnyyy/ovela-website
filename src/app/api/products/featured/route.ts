import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { rateLimit, sanitizeInput } from '@/lib/auth-middleware';

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(100, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error || 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get('limit');
    const limit = rawLimit ? parseInt(sanitizeInput(rawLimit) || '10') : 10;
    
    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 50' },
        { status: 400 }
      );
    }
    
    const result = await ProductService.getFeaturedProducts(limit);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/products/featured:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}