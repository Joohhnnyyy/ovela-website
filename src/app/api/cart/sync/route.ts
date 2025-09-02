import { NextRequest, NextResponse } from 'next/server';
import { CartSyncService } from '@/services/cartSyncService';
import { verifyAuth, rateLimit, createAuthResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitCheck = rateLimit();
  const rateLimitResult = rateLimitCheck(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.error || 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Verify authentication
  const authResult = await verifyAuth(request);
  if (authResult.error) {
    return createAuthResponse(authResult.error, 401);
  }

  const userId = authResult.user?.uid;

  try {
    const body = await request.json();
    const { action, cartData } = body;

    switch (action) {
      case 'sync':
        const syncResult = await CartSyncService.syncCart(userId);
        return NextResponse.json(syncResult);

      case 'upload':
        if (!cartData) {
          return NextResponse.json(
            { success: false, error: 'Cart data is required for upload' },
            { status: 400 }
          );
        }
        const uploadResult = await CartSyncService.forceSyncCart(userId);
        return NextResponse.json(uploadResult);

      case 'clear':
        const clearResult = await CartSyncService.clearServerCart(userId);
        return NextResponse.json(clearResult);

      case 'status':
        const statusResult = await CartSyncService.getSyncStatus(userId);
        return NextResponse.json(statusResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cart sync API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitCheck = rateLimit();
  const rateLimitResult = rateLimitCheck(request);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.error || 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Verify authentication
  const authResult = await verifyAuth(request);
  if (authResult.error) {
    return createAuthResponse(authResult.error, 401);
  }

  const userId = authResult.user?.uid;

  try {
    // Get sync status
    const statusResult = await CartSyncService.getSyncStatus(userId);
    return NextResponse.json(statusResult);
  } catch (error) {
    console.error('Cart sync status API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}