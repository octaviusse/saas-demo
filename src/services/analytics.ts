// PostHog Analytics Service Wrapper
// Provides optional analytics tracking with defensive initialization

import posthog from 'posthog-js';

// Read environment variables at build time
const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

let analyticsEnabled = false;

// Defensive initialization - only if API key is provided
if (POSTHOG_API_KEY && typeof POSTHOG_API_KEY === 'string' && POSTHOG_API_KEY.trim().length > 0) {
  try {
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false, // Disable automatic event capture
      capture_pageview: false, // Manual pageview tracking only
      disable_session_recording: true, // No session recording for demo
      loaded: () => {
        analyticsEnabled = true;
        console.log('📊 Analytics enabled');
      }
    });
  } catch (error) {
    console.warn('⚠️  PostHog initialization failed:', error);
    // Analytics disabled, application continues normally
  }
} else {
  console.log('📊 Analytics disabled (no API key provided)');
}

export interface AnalyticsService {
  track(eventName: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  isEnabled(): boolean;
}

export const analytics: AnalyticsService = {
  /**
   * Track a custom event
   * @param eventName - Name of the event (e.g., "dashboard_viewed")
   * @param properties - Optional event properties
   */
  track: (eventName: string, properties?: Record<string, any>) => {
    if (!analyticsEnabled) return; // No-op when disabled
    
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      console.warn('⚠️  Analytics tracking failed:', error);
      // Silent failure - do not disrupt user experience
    }
  },

  /**
   * Identify a user (not used in this demo - no authentication)
   * @param userId - Unique user identifier
   * @param traits - User traits
   */
  identify: (userId: string, traits?: Record<string, any>) => {
    if (!analyticsEnabled) return; // No-op when disabled
    
    try {
      posthog.identify(userId, traits);
    } catch (error) {
      console.warn('⚠️  Analytics identify failed:', error);
    }
  },

  /**
   * Check if analytics is enabled
   * @returns true if PostHog is initialized, false otherwise
   */
  isEnabled: () => analyticsEnabled
};
