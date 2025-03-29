
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'customer' | 'vendor' | 'admin';
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-mealstock-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If a specific role is required but user doesn't have it
  if (requiredRole && (!user || user.role !== requiredRole)) {
    // If logged in but wrong role, redirect to home
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If onboarding is not completed and the user is authenticated, redirect to onboarding
  if (isAuthenticated && user && !user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If authentication and role checks pass, render the children
  return <>{children}</>;
}
