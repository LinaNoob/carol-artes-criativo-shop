
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, bucket = 'produtos') => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      if (!file) {
        throw new Error('Nenhum arquivo selecionado');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setProgress(100);
      setIsUploading(false);

      return { filePath, publicUrl };
    } catch (error: any) {
      setError(error.message);
      setIsUploading(false);
      return { error: error.message };
    }
  };

  const uploadPDF = async (file: File) => {
    return uploadImage(file, 'pdfs');
  };
  
  const deleteFile = async (path: string, bucket = 'produtos') => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  };
  
  const createSignedUrl = async (path: string, bucket = 'pdfs', expiresIn = 1800) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        throw error;
      }

      return { signedUrl: data.signedUrl };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    uploadImage,
    uploadPDF,
    deleteFile,
    createSignedUrl,
    isUploading,
    progress,
    error
  };
};
