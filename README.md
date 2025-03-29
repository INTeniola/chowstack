
# MealStock Authentication Guide

This guide explains how to set up and configure the authentication system for MealStock.

## Authentication Features

MealStock uses Supabase for authentication with the following features:

- Email/password authentication
- Social login (Google, Facebook)
- Role-based access control (Customer, Vendor, Admin)
- Profile management
- Password reset functionality
- Custom onboarding flows
- Protected routes

## Setup Instructions

### 1. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication → Settings → Email
3. Configure your email provider for authentication emails
4. Enable/disable email confirmation based on your needs

### 2. Social Auth Providers

To enable social login methods:

#### Google Auth:

1. Go to your Supabase dashboard → Authentication → Providers
2. Enable Google
3. Create OAuth credentials in Google Cloud Console
4. Add your redirect URL from Supabase to Google Cloud Console
5. Add Client ID and Secret to Supabase

#### Facebook Auth:

1. Go to your Supabase dashboard → Authentication → Providers
2. Enable Facebook
3. Create an app in Facebook Developers portal
4. Add your redirect URL from Supabase to Facebook Developers portal
5. Add Client ID and Secret to Supabase

### 3. Email Templates

For setting up custom email templates:

1. Go to Authentication → Email Templates
2. Customize:
   - Confirmation Email
   - Invitation Email
   - Magic Link Email
   - Reset Password Email
   - Change Email Address Email

### 4. SMTP Configuration

To send transactional emails (welcome emails, order confirmations, etc.):

1. Set up an SMTP server or use a service like SendGrid, Mailgun, or Resend
2. Add your SMTP credentials to Supabase Edge Functions secrets
3. Deploy the send-welcome-email Edge Function

## Using Authentication in the App

### Protected Routes

Routes that require authentication are wrapped with the `ProtectedRoute` component:

```jsx
<Route 
  path="/meal-planner" 
  element={
    <ProtectedRoute>
      <MealPlanner />
    </ProtectedRoute>
  } 
/>
```

For role-specific routes, add the `requiredRole` prop:

```jsx
<Route 
  path="/vendor" 
  element={
    <ProtectedRoute requiredRole="vendor">
      <VendorPortal />
    </ProtectedRoute>
  } 
/>
```

### Using Auth in Components

Access authentication data and functions using the `useAuth` hook:

```jsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, signOut, updateUserProfile } = useAuth();
  
  // Use auth functions and data
  
  return (
    // Component JSX
  );
}
```

## Troubleshooting

- If emails aren't being sent, check your SMTP configuration
- For social login issues, verify your OAuth credentials and redirect URLs
- For RLS policy issues, review the policies in your Supabase database

## Security Best Practices

- Never share or commit API keys
- Use Row Level Security (RLS) policies to protect data
- Implement proper validation on forms
- Use HTTPS for all communication
- Follow the principle of least privilege
