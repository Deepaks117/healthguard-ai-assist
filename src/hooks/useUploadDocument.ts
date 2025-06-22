
import { useState } from 'react';
import { uploadDocument } from '@/integrations/supabase/storage';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useUploadDocument = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const upload = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    
    try {
      console.log('Starting upload for file:', file.name);
      const result = await uploadDocument(file, user.id);
      
      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Upload successful",
        description: `${result.name} has been uploaded successfully`,
      });

      return result;
    } catch (error) {
      console.error('Upload hook error:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading
  };
};
