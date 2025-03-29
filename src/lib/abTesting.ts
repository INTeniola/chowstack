
import { analytics } from './analytics';

type ExperimentVariant = {
  id: string;
  weight: number;
};

type Experiment = {
  id: string;
  variants: ExperimentVariant[];
};

// Store assigned variants in local storage
const getAssignedVariant = (experimentId: string): string | null => {
  try {
    const storedExperiments = localStorage.getItem('ab_testing_assignments');
    if (storedExperiments) {
      const assignments = JSON.parse(storedExperiments);
      return assignments[experimentId] || null;
    }
    return null;
  } catch (e) {
    console.error('Error retrieving A/B test assignment', e);
    return null;
  }
};

// Store the assigned variant
const setAssignedVariant = (experimentId: string, variantId: string): void => {
  try {
    const storedExperiments = localStorage.getItem('ab_testing_assignments');
    const assignments = storedExperiments ? JSON.parse(storedExperiments) : {};
    assignments[experimentId] = variantId;
    localStorage.setItem('ab_testing_assignments', JSON.stringify(assignments));
  } catch (e) {
    console.error('Error storing A/B test assignment', e);
  }
};

// Get or assign a variant for an experiment
export const getVariant = (experiment: Experiment): string => {
  // Check if user already has an assigned variant
  const existingVariant = getAssignedVariant(experiment.id);
  if (existingVariant) {
    return existingVariant;
  }
  
  // Assign a new variant based on weights
  const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const variant of experiment.variants) {
    random -= variant.weight;
    if (random <= 0) {
      // Store the assignment
      setAssignedVariant(experiment.id, variant.id);
      
      // Track the assignment
      analytics.trackExperimentView(experiment.id, variant.id);
      
      return variant.id;
    }
  }
  
  // Fallback to first variant if something goes wrong
  setAssignedVariant(experiment.id, experiment.variants[0].id);
  return experiment.variants[0].id;
};

// Hook to use A/B testing in components
export const useExperiment = (experimentId: string, variants: Record<string, number>) => {
  const variantEntries = Object.entries(variants).map(([id, weight]) => ({ id, weight }));
  
  const experiment: Experiment = {
    id: experimentId,
    variants: variantEntries
  };
  
  return getVariant(experiment);
};
