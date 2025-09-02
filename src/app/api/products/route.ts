import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/productService';
import { ProductData, ProductFilters } from '@/types/database';
import { 
  verifyAdmin, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/products - Get products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(200, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    const { searchParams } = new URL(request.url);
    
    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    
    // Parse and sanitize filter parameters
    const filters: ProductFilters = {};
    
    const category = searchParams.get('category');
    if (category) {
      filters.category = sanitizeInput(category);
    }
    
    const brand = searchParams.get('brand');
    if (brand) {
      filters.brand = sanitizeInput(brand);
    }
    
    const minPriceStr = searchParams.get('minPrice');
    if (minPriceStr) {
      const minPrice = parseFloat(minPriceStr);
      if (!isNaN(minPrice) && minPrice >= 0) {
        filters.minPrice = minPrice;
      }
    }
    
    const maxPriceStr = searchParams.get('maxPrice');
    if (maxPriceStr) {
      const maxPrice = parseFloat(maxPriceStr);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        filters.maxPrice = maxPrice;
      }
    }
    
    const isFeaturedStr = searchParams.get('isFeatured');
    if (isFeaturedStr) {
      filters.isFeatured = isFeaturedStr === 'true';
    }
    
    const isActiveStr = searchParams.get('isActive');
    if (isActiveStr) {
      filters.isActive = isActiveStr === 'true';
    }
    
    const sizesStr = searchParams.get('sizes');
    if (sizesStr) {
      const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      const sizes = sizesStr.split(',').filter(size => validSizes.includes(size.trim()));
      if (sizes.length > 0) {
        filters.sizes = sizes;
      }
    }
    
    const colorsStr = searchParams.get('colors');
    if (colorsStr) {
      const colors = colorsStr.split(',').map(color => sanitizeInput(color.trim())).filter(color => color.length > 0);
      if (colors.length > 0) {
        filters.colors = colors;
      }
    }
    
    const tagsStr = searchParams.get('tags');
    if (tagsStr) {
      const tags = tagsStr.split(',').map(tag => sanitizeInput(tag.trim())).filter(tag => tag.length > 0);
      if (tags.length > 0) {
        filters.tags = tags;
      }
    }
    
    // Handle search query
    const searchQuery = searchParams.get('search');
    const sanitizedSearchQuery = searchQuery ? sanitizeInput(searchQuery) : null;
    
    let result;
    if (sanitizedSearchQuery) {
      result = await ProductService.searchProducts(sanitizedSearchQuery, limit);
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

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(20, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const rawProductData = await request.json();
    const productData: ProductData = sanitizeInput(rawProductData);
    
    // Comprehensive input validation
    const validationErrors: string[] = [];
    
    const nameError = validators.required(productData.name, 'Product name');
    if (nameError) validationErrors.push(nameError);
    
    const priceError = validators.positiveNumber(productData.price, 'Price');
    if (priceError) validationErrors.push(priceError);
    
    const categoryError = validators.required(productData.category, 'Category');
    if (categoryError) validationErrors.push(categoryError);
    
    // Validate optional fields
    if (productData.description && productData.description.length > 2000) {
      validationErrors.push('Description must be less than 2000 characters');
    }
    
    if (productData.brand && productData.brand.length > 100) {
      validationErrors.push('Brand name must be less than 100 characters');
    }
    
    if (productData.sizes && Array.isArray(productData.sizes)) {
        const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '39', '40', '41', '42', '43', '44', '45', '46', '48', '50', '52', '54'];
        const invalidSizes = productData.sizes.filter(sizeObj => {
          const sizeValue = typeof sizeObj === 'string' ? sizeObj : sizeObj?.size;
          return !validSizes.includes(sizeValue);
        });
        if (invalidSizes.length > 0) {
          validationErrors.push(`Invalid sizes found. Valid sizes: ${validSizes.join(', ')}`);
        }
      }
    
    if (productData.colors && Array.isArray(productData.colors)) {
        const invalidColors = productData.colors.filter(colorObj => {
          const colorName = typeof colorObj === 'string' ? colorObj : colorObj?.name;
          return !colorName || typeof colorName !== 'string' || colorName.length > 50;
        });
        if (invalidColors.length > 0) {
          validationErrors.push('Color names must be strings with less than 50 characters');
        }
      }
    
    if (productData.tags && Array.isArray(productData.tags)) {
      const invalidTags = productData.tags.filter(tag => typeof tag !== 'string' || tag.length > 30);
      if (invalidTags.length > 0) {
        validationErrors.push('Tags must be strings with less than 30 characters');
      }
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
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