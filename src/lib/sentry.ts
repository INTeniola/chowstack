
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN", // Replace with your actual DSN
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
      // Performance monitoring
      beforeSend(event) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
          Sentry.showReportDialog({ eventId: event.event_id });
        }
        return event;
      },
    });
  }
};

// Helper for tracking user feedback
export const sendFeedback = (feedback: {
  type: 'meal' | 'delivery' | 'preservation';
  rating: number;
  comment?: string;
  orderId?: string;
  mealId?: string;
}) => {
  Sentry.captureMessage(
    `Feedback: ${feedback.type} - Rating: ${feedback.rating}`,
    {
      level: 'info',
      tags: {
        feedbackType: feedback.type,
        rating: feedback.rating.toString(),
        ...(feedback.orderId && { orderId: feedback.orderId }),
        ...(feedback.mealId && { mealId: feedback.mealId }),
      },
      extra: {
        comment: feedback.comment || '',
      },
    }
  );
  
  // In production, this would call an API to store the feedback
  console.log('Feedback submitted:', feedback);
  
  return true;
};

// Utility to track user behavior
export const trackUserAction = (action: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: action,
    data,
    level: 'info',
  });
};

// Track edge function performance and errors
export const trackEdgeFunctionPerformance = (functionName: string, durationMs: number, success: boolean) => {
  Sentry.addBreadcrumb({
    category: 'edge-function',
    message: `Edge function: ${functionName}`,
    data: {
      durationMs,
      success,
    },
    level: success ? 'info' : 'error',
  });
  
  if (!success) {
    Sentry.captureMessage(`Edge function error: ${functionName}`, {
      level: 'error',
    });
  }
};

// Monitor edge function errors
export const captureEdgeFunctionError = (functionName: string, error: any) => {
  Sentry.captureException(error, {
    tags: {
      component: 'edge-function',
      functionName,
    },
  });
};
