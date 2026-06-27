import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useStorage() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Sanitize filename
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${path}/${Date.now()}_${safeName}`;
      
      if (onProgress) onProgress(10); // Fake initial progress since Supabase doesn't have native upload progress in JS client yet
      
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      if (onProgress) onProgress(100);
      setUploadProgress(100);

      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(storagePath);
        
      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (fileUrl: string): Promise<void> => {
    if (!fileUrl) return;
    try {
      // Extract the path from the Supabase public URL
      // Format: https://[projectId].supabase.co/storage/v1/object/public/portfolio/[path]
      const url = new URL(fileUrl);
      const parts = url.pathname.split('/public/portfolio/');
      if (parts.length > 1) {
        const storagePath = decodeURIComponent(parts[1]);
        const { error } = await supabase.storage
          .from('portfolio')
          .remove([storagePath]);
          
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Error deleting file:', err);
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploadProgress,
    isUploading,
    error
  };
}

