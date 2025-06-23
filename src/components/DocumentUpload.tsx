
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScanCompliance, ScanResult } from '@/hooks/useScanCompliance';
import { uploadDocument } from '@/integrations/supabase/storage';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { scanDocument, isScanning, scanResult } = useScanCompliance();
  const { user } = useAuth();
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file || !user) return;

      setUploadedFile(file);
      setIsUploading(true);

      try {
        // Upload file to Supabase storage
        const { path, name, error } = await uploadDocument(file, user.id);
        
        if (error) {
          toast({
            title: "Upload failed",
            description: error,
            variant: "destructive",
          });
          return;
        }

        // Read file content for scanning
        const fileContent = await file.text();
        
        // Scan the document
        await scanDocument(fileContent, path, name);
        
        toast({
          title: "File uploaded successfully",
          description: `${name} has been uploaded and scanned.`,
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "An error occurred while uploading the file.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  });

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIssueVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Document Upload & Compliance Scan</span>
          </CardTitle>
          <CardDescription>
            Upload documents to automatically scan for HIPAA and GDPR compliance issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-[#003366] bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {isUploading || isScanning ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
                <p className="text-sm text-gray-600">
                  {isUploading ? 'Uploading file...' : 'Scanning document...'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <File className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop a document here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">
                  Supports TXT, PDF, DOC, DOCX files
                </p>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{uploadedFile.name}</span>
                <Badge variant="outline">{(uploadedFile.size / 1024).toFixed(1)} KB</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Compliance Scan Results</span>
              <div className="flex items-center space-x-2">
                {scanResult.score >= 80 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={scanResult.score >= 80 ? "default" : "destructive"}>
                  {scanResult.score}% Compliant
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {scanResult.issues.length} compliance issues found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanResult.issues.length > 0 ? (
              <div className="space-y-4">
                {scanResult.issues.map((issue, index) => (
                  <Alert key={index}>
                    <div className="flex items-start space-x-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge variant={getIssueVariant(issue.type)}>
                            {issue.type}
                          </Badge>
                        </div>
                        <AlertDescription className="mb-2">
                          {issue.description}
                        </AlertDescription>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Suggestion:</strong> {issue.suggestion}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  No Compliance Issues Found
                </h3>
                <p className="text-green-600">
                  Your document appears to be fully compliant with selected standards.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
