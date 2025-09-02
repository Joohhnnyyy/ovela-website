import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/userService';
import { UserData, Address } from '@/types/database';
import { rateLimit, verifyAdmin, verifyUserAccess, createAuthResponse, validators, sanitizeInput } from '@/lib/auth-middleware';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(50, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    const { id } = await params;
    
    // Validate user ID
    const idError = validators.required(id, 'User ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }
    
    // Authentication required - admin or user accessing their own data
    const authResult = await verifyUserAccess(request, id);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }
    
    const result = await UserService.getUserById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'User not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
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

    const { id } = await params;
    
    // Validate user ID
    const idError = validators.required(id, 'User ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }
    
    // Authentication required - admin or user updating their own data
    const authResult = await verifyUserAccess(request, id);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const body = await request.json();
    const updates: Partial<UserData> = {};
    
    // Validate and sanitize updates
    const validationErrors: string[] = [];
    
    if (body.email !== undefined) {
      const emailError = validators.required(body.email, 'Email');
      if (emailError) {
        validationErrors.push(emailError);
      } else if (!validators.email(body.email)) {
        validationErrors.push('Invalid email format');
      } else {
        updates.email = sanitizeInput(body.email);
      }
    }
    
    if (body.displayName !== undefined) {
      const displayNameError = validators.required(body.displayName, 'Display name');
      if (displayNameError) {
        validationErrors.push(displayNameError);
      } else {
        const sanitizedDisplayName = sanitizeInput(body.displayName);
        if (!sanitizedDisplayName || sanitizedDisplayName.length > 50) {
          validationErrors.push('Display name must be a valid string with maximum 50 characters');
        } else {
          updates.displayName = sanitizedDisplayName;
        }
      }
    }
    
    if (body.firstName !== undefined) {
      const firstNameError = validators.required(body.firstName, 'First name');
      if (firstNameError) {
        validationErrors.push(firstNameError);
      } else {
        const sanitizedFirstName = sanitizeInput(body.firstName);
        if (!sanitizedFirstName || sanitizedFirstName.length > 50) {
          validationErrors.push('First name must be a valid string with maximum 50 characters');
        } else {
          updates.firstName = sanitizedFirstName;
        }
      }
    }
    
    if (body.lastName !== undefined) {
      const lastNameError = validators.required(body.lastName, 'Last name');
      if (lastNameError) {
        validationErrors.push(lastNameError);
      } else {
        const sanitizedLastName = sanitizeInput(body.lastName);
        if (!sanitizedLastName || sanitizedLastName.length > 50) {
          validationErrors.push('Last name must be a valid string with maximum 50 characters');
        } else {
          updates.lastName = sanitizedLastName;
        }
      }
    }
    
    if (body.phoneNumber !== undefined && body.phoneNumber !== null) {
      const sanitizedPhone = sanitizeInput(body.phoneNumber);
      if (sanitizedPhone && (sanitizedPhone.length < 10 || sanitizedPhone.length > 15)) {
        validationErrors.push('Phone number must be between 10 and 15 characters');
      } else {
        updates.phoneNumber = sanitizedPhone;
      }
    }
    
    if (body.address !== undefined && body.address !== null) {
      const address = body.address as Address;
      const sanitizedAddress: Address = {
        street: sanitizeInput(address.street) || '',
        city: sanitizeInput(address.city) || '',
        state: sanitizeInput(address.state) || '',
        zipCode: sanitizeInput(address.zipCode) || '',
        country: sanitizeInput(address.country) || ''
      };
      
      if (sanitizedAddress.street.length > 100 || sanitizedAddress.city.length > 50 ||
          sanitizedAddress.state.length > 50 || sanitizedAddress.zipCode.length > 20 ||
          sanitizedAddress.country.length > 50) {
        validationErrors.push('Address fields exceed maximum length limits');
      } else {
        updates.address = sanitizedAddress;
      }
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }
    
    const result = await UserService.updateUser(id, updates);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'User not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(10, 15 * 60 * 1000)(request);
    if (!rateLimitResult.allowed) {
      return createAuthResponse(rateLimitResult.error || 'Rate limit exceeded', 429);
    }

    // Admin authentication required for user deletion
    const authResult = await verifyAdmin(request);
    if (authResult.error) {
      return createAuthResponse(authResult.error);
    }

    const { id } = await params;
    
    // Validate user ID
    const idError = validators.required(id, 'User ID');
    if (idError) {
      return NextResponse.json({ error: idError }, { status: 400 });
    }
    
    const result = await UserService.deleteUser(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'User not found' ? 404 : 400 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}