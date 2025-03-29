
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AuthProvider } from './hooks/useAuth';
import { VendorAuthProvider } from './hooks/useVendorAuth';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="mealstock-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <VendorAuthProvider>
              <NotificationsProvider>
                <App />
                <Toaster />
              </NotificationsProvider>
            </VendorAuthProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
