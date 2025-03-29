
/**
 * Utility functions to manage local storage for offline capabilities
 */

// Meals and preservation data storage keys
const MEAL_PLANS_KEY = 'mealstock:meal-plans';
const PRESERVATION_GUIDES_KEY = 'mealstock:preservation-guides';
const LAST_SYNC_KEY = 'mealstock:last-sync';
const STORAGE_VERSION = 'mealstock:storage-version';

// Local Storage Utils
const localStorageUtils = {
  // Store meal plans for offline access
  saveMealPlans: (plans: any) => {
    try {
      localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error saving meal plans to local storage:', error);
      return false;
    }
  },

  // Get saved meal plans
  getMealPlans: () => {
    try {
      const data = localStorage.getItem(MEAL_PLANS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving meal plans from local storage:', error);
      return null;
    }
  },

  // Store preservation guides for offline access
  savePreservationGuides: (guides: any) => {
    try {
      localStorage.setItem(PRESERVATION_GUIDES_KEY, JSON.stringify(guides));
      return true;
    } catch (error) {
      console.error('Error saving preservation guides to local storage:', error);
      return false;
    }
  },

  // Get saved preservation guides
  getPreservationGuides: () => {
    try {
      const data = localStorage.getItem(PRESERVATION_GUIDES_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving preservation guides from local storage:', error);
      return null;
    }
  },

  // Get last sync time
  getLastSyncTime: () => {
    try {
      const timestamp = localStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      console.error('Error retrieving last sync time:', error);
      return null;
    }
  },

  // Clear all cached data
  clearCache: () => {
    try {
      localStorage.removeItem(MEAL_PLANS_KEY);
      localStorage.removeItem(PRESERVATION_GUIDES_KEY);
      localStorage.removeItem(LAST_SYNC_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  },

  // Check if we have a storage version mismatch
  checkStorageVersion: (currentVersion: string) => {
    try {
      const storedVersion = localStorage.getItem(STORAGE_VERSION);
      if (!storedVersion || storedVersion !== currentVersion) {
        localStorage.setItem(STORAGE_VERSION, currentVersion);
        return false; // Version mismatch or first run
      }
      return true; // Version match
    } catch (error) {
      console.error('Error checking storage version:', error);
      return false;
    }
  }
};

export default localStorageUtils;
