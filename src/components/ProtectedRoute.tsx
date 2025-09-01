'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !currentUser) {
        router.push(redirectTo);
      } else if (!requireAuth && currentUser) {
        // Redirect authenticated users away from auth pages
        router.push('/');
      }
    }
  }, [currentUser, loading, requireAuth, redirectTo, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // For auth pages, don't render if user is already authenticated
  if (!requireAuth && currentUser) {
    return null;
  }

  // For protected pages, don't render if user is not authenticated
  if (requireAuth && !currentUser) {
    return null;
  }

  return <>{children}</>;
}