
/**
 * Nigeria-specific mobile device information based on market research
 * Helps tailor the responsive design for the Nigerian market
 */

// Most popular device viewport sizes in Nigeria based on market research
export const popularNigerianDeviceSizes = [
  { name: 'Tecno Spark 10', width: 360, height: 780, marketShare: '12%' },
  { name: 'Infinix Hot 20', width: 393, height: 851, marketShare: '10%' },
  { name: 'Samsung Galaxy A14', width: 412, height: 915, marketShare: '8%' },
  { name: 'Tecno Camon 20', width: 393, height: 873, marketShare: '7%' },
  { name: 'Nokia G11', width: 360, height: 800, marketShare: '5%' },
  { name: 'iPhone (Various)', width: 390, height: 844, marketShare: '4%' },
];

// Common viewport breakpoints optimized for Nigerian market
export const nigerianBreakpoints = {
  xs: 320, // Small feature phones still common in rural areas
  sm: 360, // Most common budget Android phones
  md: 393, // Mid-range Android devices
  lg: 412, // Larger Android devices
  xl: 768, // Tablets (less common in Nigeria)
};

// Network conditions in different regions of Nigeria
export const nigerianNetworkConditions = {
  urbanAreas: {
    averageSpeed: '7-15 Mbps',
    connectionType: '4G/LTE',
    reliability: 'moderate',
  },
  suburbanAreas: {
    averageSpeed: '3-7 Mbps',
    connectionType: '3G/4G',
    reliability: 'variable',
  },
  ruralAreas: {
    averageSpeed: '1-3 Mbps',
    connectionType: '2G/3G',
    reliability: 'poor',
  },
};

// Helper function to detect if the current device matches a common Nigerian device
export const isCommonNigerianDeviceSize = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const viewportWidth = window.innerWidth;
  
  return popularNigerianDeviceSizes.some(
    device => Math.abs(device.width - viewportWidth) < 30
  );
};

// Helper to get the appropriate font size based on device width
export const getOptimalFontSize = (baseSize: number) => {
  if (typeof window === 'undefined') {
    return baseSize;
  }
  
  const viewportWidth = window.innerWidth;
  
  // Adjust font sizes for very small screens common in rural areas
  if (viewportWidth < nigerianBreakpoints.xs) {
    return baseSize * 0.9;
  }
  
  // Slightly smaller fonts for most common Nigerian phone sizes
  if (viewportWidth < nigerianBreakpoints.sm) {
    return baseSize * 0.95;
  }
  
  return baseSize;
};
