
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X, Image, File, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  StorageBucket, 
  uploadFile, 
  allowedImageTypes,
  allowedDocumentTypes
} from '@/utils/storageUtils';
import { useAuth } from '@/hooks/useAuth';

interface FileUploadProps {
  bucket: StorageBucket;
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  showPreview?: boolean;
  buttonText?: string;
  path?: string;
  className?: string;
  optimizeImages?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  onUploadComplete,
  onUploadError,
  accept = "image/*,application/pdf",
  maxSize,
  showPreview = true,
  buttonText = "Upload File",
  path,
  className = "",
  optimizeImages = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Clear previous preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setFileName(file.name);
    setFileType(file.type);

    // File size validation
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      const errorMsg = `File is too large. Maximum size is ${maxSizeMB}MB.`;
      toast.error('Upload failed', { description: errorMsg });
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    // Generate preview for images
    if (allowedImageTypes.includes(file.type) && showPreview) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    // Start upload
    setUploading(true);
    setProgress(0);

    try {
      const fileUrl = await uploadFile({
        userId: user.id,
        file,
        bucket,
        path,
        onProgress: setProgress,
        optimize: optimizeImages && allowedImageTypes.includes(file.type)
      });

      if (fileUrl) {
        setProgress(100);
        onUploadComplete(fileUrl);
        toast.success('Upload complete', { description: 'File has been uploaded successfully' });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload file. Please try again.';
      toast.error('Upload failed', { description: errorMsg });
      if (onUploadError) onUploadError(errorMsg);
    } finally {
      setUploading(false);
      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileName(null);
    setFileType(null);
    setProgress(0);
  };

  // Determine icon based on file type
  const renderFileIcon = () => {
    if (!fileType) return <Upload className="h-5 w-5" />;
    if (allowedImageTypes.includes(fileType)) return <Image className="h-5 w-5" />;
    if (fileType === "application/pdf") return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />

      {!uploading && !previewUrl && !fileName && (
        <Button 
          type="button" 
          onClick={triggerFileInput} 
          variant="outline" 
          className="w-full h-24 border-dashed flex flex-col gap-2"
        >
          <Upload className="h-6 w-6" />
          <span>{buttonText}</span>
        </Button>
      )}

      {(previewUrl || fileName) && (
        <div className="relative border rounded-md p-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            {previewUrl ? (
              <div className="relative w-16 h-16 overflow-hidden rounded border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-muted rounded border">
                {renderFileIcon()}
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{fileName}</p>
              {uploading ? (
                <div className="space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progress)}% uploaded
                  </p>
                </div>
              ) : progress === 100 ? (
                <div className="flex items-center text-xs text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>Upload complete</span>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-1"
                  onClick={triggerFileInput}
                >
                  Change file
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
