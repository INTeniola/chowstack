
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

type ImageSize = 'small' | 'medium' | 'large';

interface OptimizedImageOptions {
  src: string;
  size?: ImageSize;
  lowBandwidth?: boolean;
  fallbackSrc?: string;
}

interface UseOptimizedImageResult {
  optimizedSrc: string;
  isLoading: boolean;
  error: boolean;
  imgProps: {
    src: string;
    loading: "lazy" | "eager";
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    className?: string;
  };
}

// Check if the device is on a slow connection
const isSlowConnection = (): boolean => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    // @ts-ignore - connection property exists but TypeScript doesn't know about it
    const connection = navigator.connection;
    if (connection) {
      // @ts-ignore - effectiveType property exists but TypeScript doesn't know about it
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return true;
      }
      // @ts-ignore - downlink property exists but TypeScript doesn't know about it
      if (connection.downlink < 0.7) {
        return true;
      }
    }
  }
  return false;
};

// Default placeholder for low bandwidth mode
const LOW_BANDWIDTH_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23cccccc"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%23333333"%3EImage%3C/text%3E%3C/svg%3E';

export function useOptimizedImage({
  src,
  size = 'medium',
  lowBandwidth = false,
  fallbackSrc,
}: OptimizedImageOptions): UseOptimizedImageResult {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);

    // Skip optimization for data URLs
    if (src.startsWith('data:')) {
      setOptimizedSrc(src);
      setIsLoading(false);
      return;
    }

    // Check if we should use low bandwidth mode
    const forceLowBandwidth = lowBandwidth || isSlowConnection();
    
    // For mock/static images just return the original source
    if (src.includes('unsplash') || src.includes('githubusercontent') || !src.startsWith('http')) {
      setOptimizedSrc(forceLowBandwidth ? LOW_BANDWIDTH_PLACEHOLDER : src);
      setIsLoading(false);
      return;
    }
    
    try {
      // This is where we would normally apply image transformations
      // For example, with a CDN like Cloudinary, Imgix, etc.
      // For now, we'll just simulate the behavior
      let optimized = src;
      
      // Simple simulation of width selection based on device and size
      const width = isMobile ? 
        (size === 'small' ? 300 : size === 'medium' ? 600 : 900) :
        (size === 'small' ? 400 : size === 'medium' ? 800 : 1200);
      
      // If a real image service were available, we'd use something like:
      // optimized = `https://cdn.example.com/${src}?w=${width}&q=75`
      
      // Check for low bandwidth mode
      if (forceLowBandwidth) {
        // In low bandwidth mode, either use a placeholder or reduce quality dramatically
        optimized = LOW_BANDWIDTH_PLACEHOLDER;
      }
      
      setOptimizedSrc(optimized);
      setIsLoading(false);
    } catch (err) {
      console.error('Error optimizing image:', err);
      setOptimizedSrc(fallbackSrc || src);
      setError(true);
      setIsLoading(false);
    }
  }, [src, size, lowBandwidth, isMobile, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', src);
    setError(true);
    
    // Use fallback if available
    if (fallbackSrc && e.currentTarget) {
      e.currentTarget.src = fallbackSrc;
    } else if (e.currentTarget) {
      // Use default placeholder
      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23eeeeee"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="%23999999"%3EImage not available%3C/text%3E%3C/svg%3E';
    }
  };

  return {
    optimizedSrc,
    isLoading,
    error,
    imgProps: {
      src: optimizedSrc,
      loading: "lazy",
      onError: handleError,
      className: isLoading ? 'animate-pulse' : '',
    },
  };
}

// Component to use the hook
export function OptimizedImage({
  src, 
  alt, 
  size = 'medium',
  lowBandwidth,
  className = '',
  fallbackSrc
}: {
  src: string;
  alt: string;
  size?: ImageSize;
  lowBandwidth?: boolean;
  className?: string;
  fallbackSrc?: string;
}) {
  const { imgProps } = useOptimizedImage({ 
    src, 
    size, 
    lowBandwidth,
    fallbackSrc
  });
  
  return (
    <img 
      {...imgProps} 
      alt={alt} 
      className={`${className} ${imgProps.className}`}
    />
  );
}
