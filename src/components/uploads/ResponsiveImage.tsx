
import React from 'react';
import { OptimizedImage } from '@/hooks/use-image-optimization';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
  lowBandwidth?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  fallbackSrc = '/placeholder.svg',
  lowBandwidth
}) => {
  // Generate URLs for responsive images
  const getResponsiveUrl = (url: string, width: number): string => {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('width', width.toString());
      return parsedUrl.toString();
    } catch (e) {
      // If URL parsing fails, return the original URL
      return url;
    }
  };

  // No computation needed if using lowBandwidth
  if (lowBandwidth) {
    return (
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        fallbackSrc={fallbackSrc}
        lowBandwidth={true}
        size="small"
      />
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
      size="medium"
    />
  );
};
