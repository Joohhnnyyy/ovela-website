import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { rateLimit, validators, sanitizeInput } from '@/lib/auth-middleware';

// GET /api/products/category/[category] - Get products by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(100, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error || 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { category } = await params;
    
    // Validate and sanitize category
    const categoryError = validators.required(category, 'Category');
    if (categoryError) {
      return NextResponse.json({ error: categoryError }, { status: 400 });
    }
    
    const sanitizedCategory = sanitizeInput(category);
    if (!sanitizedCategory || sanitizedCategory.length > 50) {
      return NextResponse.json(
        { error: 'Category must be a valid string with maximum 50 characters' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get('limit');
    const limit = rawLimit ? parseInt(sanitizeInput(rawLimit) || '20') : 20;
    
    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 100' },
        { status: 400 }
      );
    }
    
    const result = await ProductService.getProductsByCategory(sanitizedCategory, limit);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/products/category/[category]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}