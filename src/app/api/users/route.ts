import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';
import { UserData } from '@/types/database';
import { 
  verifyAdmin, 
  rateLimit, 
  createAuthResponse, 
  sanitizeInput, 
  validators 
} from '@/lib/auth-middleware';

// GET /api/users - Get all active users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const result = await UserService.getAllActiveUsers();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(10, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error!, 429);
    }

    // Verify admin access
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const rawUserData = await request.json();
    const userData: UserData = sanitizeInput(rawUserData);
    
    // Comprehensive input validation
    const validationErrors: string[] = [];
    
    if (!validators.email(userData.email)) {
      validationErrors.push('Email must be a valid email address');
    }
    
    const displayNameError = validators.required(userData.displayName, 'Display name');
     if (displayNameError) validationErrors.push(displayNameError);
     
     const firstNameError = validators.required(userData.firstName, 'First name');
     if (firstNameError) validationErrors.push(firstNameError);
     
     const lastNameError = validators.required(userData.lastName, 'Last name');
     if (lastNameError) validationErrors.push(lastNameError);
    
    // Validate optional fields
    if (userData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(userData.phoneNumber)) {
      validationErrors.push('Phone number must be a valid international format');
    }
    
    if (userData.displayName && userData.displayName.length > 100) {
      validationErrors.push('Display name must be less than 100 characters');
    }
    
    if (userData.firstName && userData.firstName.length > 50) {
      validationErrors.push('First name must be less than 50 characters');
    }
    
    if (userData.lastName && userData.lastName.length > 50) {
      validationErrors.push('Last name must be less than 50 characters');
    }
    
    // Validate address if provided
    if (userData.address) {
      if (!userData.address.street || userData.address.street.length > 200) {
        validationErrors.push('Street address is required and must be less than 200 characters');
      }
      if (!userData.address.city || userData.address.city.length > 100) {
        validationErrors.push('City is required and must be less than 100 characters');
      }
      if (!userData.address.state || userData.address.state.length > 100) {
        validationErrors.push('State is required and must be less than 100 characters');
      }
      if (!userData.address.zipCode || !/^[0-9]{5,10}$/.test(userData.address.zipCode)) {
        validationErrors.push('Valid zip code is required (5-10 digits)');
      }
      if (!userData.address.country || userData.address.country.length > 100) {
        validationErrors.push('Country is required and must be less than 100 characters');
      }
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Generate a unique user ID (in a real app, this would come from authentication)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const result = await UserService.createUser(userId, userData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}