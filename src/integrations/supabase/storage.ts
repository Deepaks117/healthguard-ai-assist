
import { supabase } from './client';

export interface UploadResult {
  path: string;
  name: string;
  error?: string;
}

export const uploadDocument = async (
  file: File, 
  user_id: string
): Promise<UploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user_id}/${fileName}`;

    console.log('Uploading file:', fileName, 'to path:', filePath);

    const { data, error } = await supabase.storage
      .from('compliance-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { path: '', name: '', error: error.message };
    }

    console.log('Upload successful:', data);
    return { path: data.path, name: file.name };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { path: '', name: '', error: 'Upload failed' };
  }
};

export const getDocument = async (documentPath: string): Promise<{ data: Blob | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from('compliance-documents')
      .download(documentPath);

    if (error) {
      console.error('Download error:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected download error:', error);
    return { data: null, error: 'Download failed' };
  }
};

export const listUserDocuments = async (user_id: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('compliance-documents')
      .list(user_id);

    if (error) {
      console.error('List documents error:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Unexpected list error:', error);
    return { data: [], error: 'Failed to list documents' };
  }
};

export const deleteDocument = async (documentPath: string) => {
  try {
    const { error } = await supabase.storage
      .from('compliance-documents')
      .remove([documentPath]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected delete error:', error);
    return { error: 'Delete failed' };
  }
};
