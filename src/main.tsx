
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AuthProvider } from './contexts/AuthContext';
import { VendorAuthProvider } from './hooks/useVendorAuth';
import { ConnectivityProvider } from './contexts/ConnectivityContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initSentry } from './lib/sentry';

// Initialize Sentry
initSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 404s or if offline
        if (
          // @ts-ignore
          error?.status === 404 || 
          !navigator.onLine || 
          failureCount > 2
        ) {
          return false;
        }
        return true;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="mealstock-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <VendorAuthProvider>
              <ConnectivityProvider>
                <RealtimeProvider>
                  <NotificationsProvider>
                    <App />
                    <Toaster />
                  </NotificationsProvider>
                </RealtimeProvider>
              </ConnectivityProvider>
            </VendorAuthProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Register the service worker for offline capabilities
serviceWorkerRegistration.register({
  onSuccess: () => console.log('MealStock is now available offline'),
  onUpdate: (registration) => {
    console.log('New version available', registration);
    // Optional: Add UI to notify users about updates
  },
});
