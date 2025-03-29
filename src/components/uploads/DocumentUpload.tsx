
import React from 'react';
import { FileUpload } from './FileUpload';
import { StorageBucket } from '@/utils/storageUtils';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUploaded: (url: string) => void;
  title: string;
  description?: string;
  maxSize?: number;
  className?: string;
  userId: string;
  docType?: 'verification' | 'receipt';
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUploaded,
  title,
  description,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  userId,
  docType = 'verification'
}) => {
  const bucket = docType === 'verification' 
    ? StorageBucket.VERIFICATION_DOCS 
    : StorageBucket.RECEIPTS;
  
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <FileUpload
            bucket={bucket}
            onUploadComplete={onDocumentUploaded}
            accept=".pdf,image/*"
            maxSize={maxSize}
            showPreview={true}
            buttonText="Upload Document"
            path={`documents/${userId}`}
            optimizeImages={true}
          />
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Accepted formats: PDF, JPG, PNG • Max size: {Math.round(maxSize / (1024 * 1024))}MB
      </CardFooter>
    </Card>
  );
};
