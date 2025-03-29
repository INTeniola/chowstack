
import { trackUserAction } from './sentry';

export type AnalyticsEvent = {
  category: 'user' | 'order' | 'meal' | 'vendor' | 'app';
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
};

class Analytics {
  // Track any user event
  public trackEvent(event: AnalyticsEvent): void {
    console.log('Analytics event:', event);
    
    // Send to Sentry as breadcrumb
    trackUserAction(event.action, {
      category: event.category,
      label: event.label,
      value: event.value,
      ...event.properties
    });
    
    // In a real app, this would also send to a proper analytics service
    // like Google Analytics, Mixpanel, etc.
  }
  
  // Predefined event types for common actions
  public trackPageView(pageName: string, properties?: Record<string, any>): void {
    this.trackEvent({
      category: 'app',
      action: 'page_view',
      label: pageName,
      properties
    });
  }
  
  public trackMealView(mealId: string, mealName: string): void {
    this.trackEvent({
      category: 'meal',
      action: 'view',
      label: mealName,
      properties: { mealId }
    });
  }
  
  public trackAddToCart(mealId: string, mealName: string, price: number): void {
    this.trackEvent({
      category: 'order',
      action: 'add_to_cart',
      label: mealName,
      value: price,
      properties: { mealId }
    });
  }
  
  public trackPurchase(orderId: string, amount: number, items: number): void {
    this.trackEvent({
      category: 'order',
      action: 'purchase',
      label: orderId,
      value: amount,
      properties: { items }
    });
  }
  
  public trackFeedbackSubmitted(type: string, rating: number): void {
    this.trackEvent({
      category: 'user',
      action: 'feedback_submitted',
      label: type,
      value: rating
    });
  }
  
  // A/B testing tracking
  public trackExperimentView(experimentId: string, variant: string): void {
    this.trackEvent({
      category: 'app',
      action: 'experiment_view',
      label: experimentId,
      properties: { variant }
    });
  }
}

// Create and export a singleton instance
export const analytics = new Analytics();
