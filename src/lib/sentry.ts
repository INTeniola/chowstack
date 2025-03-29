
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
  type: 'meal' | 'delivery' | 'preservation' | 'app' | 'payment';
  rating: number;
  comment?: string;
  orderId?: string;
  mealId?: string;
  source?: string;
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
        ...(feedback.source && { source: feedback.source }),
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

// Track API failures
export const trackApiFailure = (
  apiName: string, 
  endpoint: string, 
  error: any, 
  requestData?: any
) => {
  Sentry.captureException(error, {
    tags: {
      component: 'api',
      apiName,
      endpoint,
    },
    extra: {
      requestData,
      errorMessage: error.message,
      errorStack: error.stack,
    },
  });
};

// Track performance metrics
export const trackPerformance = (
  operationName: string, 
  durationMs: number, 
  success: boolean, 
  metadata?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Performance: ${operationName}`,
    data: {
      durationMs,
      success,
      ...metadata,
    },
    level: success ? 'info' : 'warning',
  });
  
  // Report performance issues that exceed thresholds
  if (durationMs > getThresholdForOperation(operationName)) {
    Sentry.captureMessage(`Performance issue in ${operationName}: ${durationMs}ms`, {
      level: 'warning',
      tags: {
        component: 'performance',
        operation: operationName,
      },
      extra: {
        durationMs,
        metadata,
      },
    });
  }
};

// Get performance thresholds based on operation type
const getThresholdForOperation = (operation: string): number => {
  const thresholds: Record<string, number> = {
    'page-load': 2000,
    'api-call': 1000,
    'data-fetch': 800,
    'edge-function': 3000,
    'render': 300,
    'payment-processing': 5000,
  };
  
  // Match the operation to a threshold category
  for (const [category, threshold] of Object.entries(thresholds)) {
    if (operation.includes(category)) {
      return threshold;
    }
  }
  
  // Default threshold
  return 1000;
};

// Track user experience issues
export const trackUxIssue = (
  issueType: 'navigation-abandoned' | 'form-abandoned' | 'multiple-clicks' | 'page-timeout' | 'payment-abandoned',
  details: Record<string, any>
) => {
  Sentry.captureMessage(`UX Issue: ${issueType}`, {
    level: 'warning',
    tags: {
      component: 'user-experience',
      issueType,
    },
    extra: details,
  });
};
