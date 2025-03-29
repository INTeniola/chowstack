
import React, { useState, useEffect } from 'react';
import { useConnectivity } from '@/contexts/ConnectivityContext';

interface OptimizedImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fallbackSrc?: string;
  lowBandwidth?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

// Function to optimize image URL based on bandwidth and requested size
const getOptimizedUrl = (originalUrl: string, size: string, lowBandwidth: boolean): string => {
  // If it's already a local asset or a relative URL, return as is
  if (originalUrl.startsWith('/') || originalUrl.startsWith('./')) {
    return originalUrl;
  }
  
  // For actual optimization in production, you would use a service like Cloudinary, ImageKit, etc.
  // This is a placeholder that simulates how you would structure the URL for such services
  try {
    const url = new URL(originalUrl);
    
    // Add query parameters to indicate desired transformations
    if (lowBandwidth) {
      // In low bandwidth mode, aggressively reduce quality and size
      url.searchParams.append('quality', '60');
      url.searchParams.append('format', 'webp');
      
      switch (size) {
        case 'small':
          url.searchParams.append('width', '150');
          break;
        case 'medium':
          url.searchParams.append('width', '300');
          break;
        case 'large':
          url.searchParams.append('width', '600');
          break;
      }
    } else {
      // In normal mode, maintain good quality
      url.searchParams.append('quality', '85');
      url.searchParams.append('format', 'webp');
      
      switch (size) {
        case 'small':
          url.searchParams.append('width', '300');
          break;
        case 'medium':
          url.searchParams.append('width', '600');
          break;
        case 'large':
          url.searchParams.append('width', '1200');
          break;
      }
    }
    
    return url.toString();
  } catch (e) {
    // If URL parsing fails, return the original URL
    console.warn('Failed to optimize image URL:', originalUrl);
    return originalUrl;
  }
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  fallbackSrc = '/placeholder.svg',
  lowBandwidth: forceLowBandwidth,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { lowBandwidthMode, connectionQuality } = useConnectivity();

  // Use either forced value or the global setting
  const useLowBandwidth = forceLowBandwidth !== undefined ? forceLowBandwidth : lowBandwidthMode;
  
  // Try to get an optimized URL
  useEffect(() => {
    if (src) {
      const optimizedUrl = getOptimizedUrl(src, size, useLowBandwidth);
      setImageSrc(optimizedUrl);
      setHasError(false);
    }
  }, [src, size, useLowBandwidth]);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      console.warn(`Image failed to load: ${imageSrc}, falling back to ${fallbackSrc}`);
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    if (onError) onError();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Add loading strategy based on connection quality
  const loadingStrategy = connectionQuality === 'slow' || useLowBandwidth ? 'lazy' : 'eager';

  return (
    <div className={`relative ${className} ${!isLoaded ? 'bg-muted animate-pulse' : ''}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loadingStrategy}
      />
    </div>
  );
};

// Custom hook for determining if current page should use image optimization
export const useImageOptimization = () => {
  const { lowBandwidthMode, connectionQuality } = useConnectivity();
  
  const shouldOptimizeImages = lowBandwidthMode || connectionQuality === 'slow';
  const optimizationLevel = lowBandwidthMode ? 'high' : connectionQuality === 'slow' ? 'medium' : 'low';
  
  return {
    shouldOptimizeImages,
    optimizationLevel,
    isLowBandwidth: lowBandwidthMode,
    connectionQuality
  };
};
