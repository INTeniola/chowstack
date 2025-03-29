
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/utils/authUtils';
import { toast } from 'sonner';

/**
 * Enum for storage buckets
 */
export enum StorageBucket {
  MEAL_IMAGES = 'meal-images',
  VENDOR_LOGOS = 'vendor-logos',
  USER_AVATARS = 'user-avatars',
  VERIFICATION_DOCS = 'verification-docs',
  RECEIPTS = 'receipts'
}

/**
 * File type restrictions
 */
export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const allowedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * Size limits (in bytes)
 */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_MEAL_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * Image size constants
 */
export const imageSizes = {
  thumbnail: { width: 200, height: 200 },
  small: { width: 400, height: 400 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 }
};

/**
 * Helper interface for file upload options
 */
interface UploadOptions {
  userId: string;
  file: File;
  bucket: StorageBucket;
  path?: string;
  onProgress?: (progress: number) => void;
  optimize?: boolean;
}

/**
 * Construct the storage path for a file
 */
export const getStoragePath = (userId: string, fileName: string, path?: string): string => {
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = new Date().getTime();
  const uniqueFileName = `${timestamp}_${cleanFileName}`;
  
  if (path) {
    return `${userId}/${path}/${uniqueFileName}`;
  }
  return `${userId}/${uniqueFileName}`;
};

/**
 * Validate file type and size
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[], 
  maxSize: number
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Optimize an image before upload
 */
export const optimizeImage = async (
  file: File, 
  maxWidth: number = 1200, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if larger than max dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            
            // Create new file from blob
            const optimizedFile = new File(
              [blob], 
              file.name, 
              { 
                type: 'image/jpeg',
                lastModified: Date.now() 
              }
            );
            
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async ({
  userId,
  file,
  bucket,
  path,
  onProgress,
  optimize = false
}: UploadOptions): Promise<string | null> => {
  try {
    let fileToUpload = file;
    let validationResult;
    
    // Validate file based on bucket type
    if (bucket === StorageBucket.USER_AVATARS || bucket === StorageBucket.VENDOR_LOGOS) {
      validationResult = validateFile(file, allowedImageTypes, MAX_AVATAR_SIZE);
    } else if (bucket === StorageBucket.MEAL_IMAGES) {
      validationResult = validateFile(file, allowedImageTypes, MAX_MEAL_IMAGE_SIZE);
    } else {
      validationResult = validateFile(file, allowedDocumentTypes, MAX_DOCUMENT_SIZE);
    }
    
    if (!validationResult.valid) {
      toast.error('File validation failed', {
        description: validationResult.error
      });
      return null;
    }
    
    // Optimize image if requested and it's an image
    if (optimize && allowedImageTypes.includes(file.type)) {
      const maxWidth = (bucket === StorageBucket.USER_AVATARS || bucket === StorageBucket.VENDOR_LOGOS) 
        ? imageSizes.medium.width 
        : imageSizes.large.width;
      
      fileToUpload = await optimizeImage(file, maxWidth);
    }
    
    const filePath = getStoragePath(userId, fileToUpload.name, path);
    
    // Create upload options, and handle progress separately if provided
    const uploadOptions: any = {
      cacheControl: '3600',
      upsert: true
    };

    // Setup a progress callback if requested
    if (onProgress) {
      // Using event listener pattern instead of onUploadProgress
      const uploadTask = supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, uploadOptions);
        
      // We can't directly track progress with the current Supabase JS client
      // Mocking progress for now
      let mockProgress = 0;
      const progressInterval = setInterval(() => {
        mockProgress += 10;
        if (mockProgress <= 90) {
          onProgress(mockProgress);
        } else {
          clearInterval(progressInterval);
        }
      }, 300);

      const { data, error } = await uploadTask;
      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }
      
      onProgress(100);
      
      // Return the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    } else {
      // Without progress tracking
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, uploadOptions);
      
      if (error) {
        throw error;
      }
      
      // Return the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    toast.error('Error uploading file', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (
  bucket: StorageBucket,
  path: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting file:', error);
    toast.error('Error deleting file', {
      description: error.message || 'Please try again later'
    });
    return false;
  }
};

/**
 * Extract file path from public URL
 */
export const getPathFromUrl = (url: string, bucket: StorageBucket): string | null => {
  try {
    // Get the base URL for this bucket without directly accessing storageUrl
    const { data } = supabase.storage.from(bucket).getPublicUrl('');
    const baseUrl = data.publicUrl.split('/').slice(0, -1).join('/') + '/';
    
    if (url.startsWith(baseUrl)) {
      return url.replace(baseUrl, '');
    }
    return null;
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
};
