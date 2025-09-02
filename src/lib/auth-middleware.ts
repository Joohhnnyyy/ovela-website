import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

/**
 * Middleware to verify user authentication from request headers
 */
export async function verifyAuth(request: NextRequest): Promise<{ user?: any; error?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header' };
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return { error: 'Missing authentication token' };
    }

    // Validate token length and format
    if (token.length < 20 || token.length > 2048) {
      return { error: 'Invalid token format' };
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Token verification failed:', error);
      return { error: 'Invalid or expired token' };
    }

    // Default to 'user' role since role column doesn't exist yet
    // TODO: Add role column to users table and implement proper role management
    const role = 'user';
    
    return {
      user: {
        uid: user.id,
        email: user.email,
        role: role
      }
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Authentication failed' };
  }
}

/**
 * Middleware to check if user is admin
 */
export async function verifyAdmin(request: NextRequest): Promise<{ user?: any; error?: string }> {
  const authResult = await verifyAuth(request);
  
  if (authResult.error) {
    return authResult;
  }
  
  if (authResult.user?.role !== 'admin') {
    return { error: 'Admin access required' };
  }
  
  return authResult;
}

/**
 * Middleware to verify user owns the resource
 */
export async function verifyUserAccess(
  request: NextRequest, 
  resourceUserId: string
): Promise<{ user?: any; error?: string }> {
  const authResult = await verifyAuth(request);
  
  if (authResult.error) {
    return authResult;
  }
  
  // Admin can access any resource
  if (authResult.user?.role === 'admin') {
    return authResult;
  }
  
  // User can only access their own resources
  if (authResult.user?.uid !== resourceUserId) {
    return { error: 'Access denied: insufficient permissions' };
  }
  
  return authResult;
}

/**
 * Enhanced rate limiting store with different buckets
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked?: boolean;
  blockUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const authAttemptStore = new Map<string, RateLimitEntry>();

/**
 * Enhanced rate limiting middleware with progressive penalties
 */
export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  blockDuration: number = 60 * 60 * 1000 // 1 hour block after repeated violations
) {
  return (request: NextRequest): { allowed: boolean; error?: string; retryAfter?: number } => {
    const clientIp = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const key = `${clientIp}:${hashString(userAgent)}`;
    const now = Date.now();
    
    const current = rateLimitStore.get(key);
    
    // Check if currently blocked
    if (current?.blocked && current.blockUntil && now < current.blockUntil) {
      return {
        allowed: false,
        error: 'IP temporarily blocked due to excessive requests',
        retryAfter: Math.ceil((current.blockUntil - now) / 1000)
      };
    }
    
    if (!current || now > current.resetTime) {
      // Reset or initialize
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true };
    }
    
    if (current.count >= maxRequests) {
      // Block IP for repeated violations
      const violations = (current.count - maxRequests) + 1;
      const blockTime = blockDuration * Math.min(violations, 5); // Max 5x block duration
      
      rateLimitStore.set(key, {
        ...current,
        blocked: true,
        blockUntil: now + blockTime
      });
      
      return {
        allowed: false,
        error: 'Rate limit exceeded. IP temporarily blocked.',
        retryAfter: Math.ceil(blockTime / 1000)
      };
    }
    
    // Increment count
    current.count++;
    rateLimitStore.set(key, current);
    
    return { allowed: true };
  };
}

/**
 * Brute force protection for authentication attempts
 */
export function authRateLimit(
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  blockDuration: number = 30 * 60 * 1000 // 30 minutes block
) {
  return (request: NextRequest, identifier?: string): { allowed: boolean; error?: string; retryAfter?: number } => {
    const clientIp = getClientIp(request);
    const key = identifier ? `auth:${identifier}` : `auth:ip:${clientIp}`;
    const now = Date.now();
    
    const current = authAttemptStore.get(key);
    
    // Check if currently blocked
    if (current?.blocked && current.blockUntil && now < current.blockUntil) {
      return {
        allowed: false,
        error: 'Too many failed authentication attempts. Please try again later.',
        retryAfter: Math.ceil((current.blockUntil - now) / 1000)
      };
    }
    
    if (!current || now > current.resetTime) {
      // Reset or initialize
      authAttemptStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return { allowed: true };
    }
    
    if (current.count >= maxAttempts) {
      // Block for authentication attempts
      authAttemptStore.set(key, {
        ...current,
        blocked: true,
        blockUntil: now + blockDuration
      });
      
      return {
        allowed: false,
        error: 'Too many failed authentication attempts. Account temporarily locked.',
        retryAfter: Math.ceil(blockDuration / 1000)
      };
    }
    
    // Increment count
    current.count++;
    authAttemptStore.set(key, current);
    
    return { allowed: true };
  };
}

/**
 * Reset authentication attempts on successful login
 */
export function resetAuthAttempts(identifier: string, clientIp: string): void {
  authAttemptStore.delete(`auth:${identifier}`);
  authAttemptStore.delete(`auth:ip:${clientIp}`);
}

/**
 * Get client IP with proper header precedence
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-client-ip') || 
         'unknown';
}

/**
 * Hash string for consistent key generation
 */
function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

/**
 * Helper function to create protected API responses
 */
export function createAuthResponse(error: string, status: number = 401): NextResponse {
  return NextResponse.json(
    { error, timestamp: new Date().toISOString() },
    { status }
  );
}

/**
 * Input sanitization helpers
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Basic XSS prevention
    return input
      .replace(/[<>"'&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[match] || match;
      })
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Validation helpers
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  required: (value: any, fieldName: string): string | null => {
    if (value === undefined || value === null || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  },
  
  positiveNumber: (value: any, fieldName: string): string | null => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  }
};