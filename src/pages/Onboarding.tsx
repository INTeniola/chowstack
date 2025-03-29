
import React from 'react';
import { Navigate } from 'react-router-dom';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Onboarding = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-mealstock-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If onboarding is already completed, redirect to the appropriate page
  if (user.onboardingCompleted) {
    return <Navigate to={user.role === 'vendor' ? '/vendor' : '/'} replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-mealstock-cream/30">
        <OnboardingFlow user={user} />
      </main>
      <Footer />
    </div>
  );
};

export default Onboarding;
