
import React, { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { StorageBucket, allowedImageTypes } from '@/utils/storageUtils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, UploadCloud, User } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  initialImage?: string;
  bucketType: 'avatar' | 'meal' | 'logo';
  shape?: 'square' | 'circle';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  initialImage,
  bucketType,
  shape = 'square',
  className = '',
  size = 'md',
  showLabel = false,
  label
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
  
  useEffect(() => {
    setImageUrl(initialImage);
  }, [initialImage]);
  
  const getBucket = (): StorageBucket => {
    switch (bucketType) {
      case 'avatar':
        return StorageBucket.USER_AVATARS;
      case 'meal':
        return StorageBucket.MEAL_IMAGES;
      case 'logo':
        return StorageBucket.VENDOR_LOGOS;
      default:
        return StorageBucket.USER_AVATARS;
    }
  };
  
  const getSizeClass = (): string => {
    switch (size) {
      case 'sm':
        return shape === 'circle' ? 'h-16 w-16' : 'h-24 w-24';
      case 'md':
        return shape === 'circle' ? 'h-24 w-24' : 'h-40 w-40';
      case 'lg':
        return shape === 'circle' ? 'h-32 w-32' : 'h-56 w-56';
      default:
        return shape === 'circle' ? 'h-24 w-24' : 'h-40 w-40';
    }
  };
  
  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
  };
  
  const renderPlaceholder = () => {
    if (shape === 'circle') {
      return (
        <Avatar className={`${getSizeClass()} border-2 border-dashed border-muted-foreground/25`}>
          <AvatarFallback className="bg-muted flex flex-col items-center justify-center">
            <User className="h-1/3 w-1/3 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>
      );
    }
    
    return (
      <div className={`${getSizeClass()} rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted flex flex-col items-center justify-center`}>
        <Image className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <span className="text-xs text-muted-foreground">Upload Image</span>
      </div>
    );
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showLabel && label && (
        <p className="text-sm font-medium mb-2">{label}</p>
      )}
      
      <div className="relative group">
        {imageUrl ? (
          shape === 'circle' ? (
            <Avatar className={getSizeClass()}>
              <AvatarImage src={imageUrl} alt="Uploaded image" />
              <AvatarFallback className="bg-muted">
                <User className="h-1/3 w-1/3" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={`${getSizeClass()} rounded-md overflow-hidden relative`}>
              <img 
                src={imageUrl} 
                alt="Uploaded image" 
                className="w-full h-full object-cover"
              />
            </div>
          )
        ) : (
          renderPlaceholder()
        )}
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
          <FileUpload
            bucket={getBucket()}
            onUploadComplete={handleUploadComplete}
            accept="image/*"
            showPreview={false}
            optimizeImages={true}
            buttonText=""
            className="hidden"
          />
          <Button
            type="button" 
            variant="secondary"
            size="sm"
            className="flex gap-1 items-center"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          >
            <UploadCloud className="h-4 w-4" />
            {imageUrl ? 'Change' : 'Upload'}
          </Button>
        </div>
      </div>
      
      {showLabel && !label && (
        <p className="text-sm text-muted-foreground mt-2">
          {imageUrl ? 'Click to change' : 'Click to upload'}
        </p>
      )}
    </div>
  );
};
