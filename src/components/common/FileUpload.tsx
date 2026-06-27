import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { FiUploadCloud, FiX, FiCheck, FiFile } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface FileUploadProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  folder?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onUploadSuccess,
  currentUrl,
  accept = 'image/*',
  folder = 'uploads',
  maxSizeMB = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes('image');

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    onUploadSuccess('');
    resetInput();
    setErrorMsg(null);
    setProgress(0);
  };

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be less than ${maxSizeMB}MB`);
      resetInput();
      return;
    }

    // Sanitize filename - remove spaces and special chars
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${safeName}`;

    setIsUploading(true);
    setProgress(10); // Fake initial progress
    setErrorMsg(null);

    try {
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(storagePath);
        
      onUploadSuccess(publicUrlData.publicUrl);
      toast.success('Uploaded successfully!');
    } catch (err: any) {
      console.error('Upload error:', err);
      let msg = 'Upload failed. ';
      if (err.message.includes('permission denied') || err.statusCode === '403') {
        msg += 'Permission denied — check Supabase Storage RLS policies.';
      } else {
        msg += err.message;
      }
      setErrorMsg(msg);
      toast.error(msg, { duration: 6000 });
    } finally {
      setIsUploading(false);
      resetInput();
    }
  }, [folder, maxSizeMB, onUploadSuccess]);

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-medium text-neu-text ml-1">
        {label}
      </label>

      <div className="w-full bg-neu-surface rounded-xl border border-[#8EB69B] overflow-hidden">
        {/* Uploaded state */}
        {currentUrl && !isUploading ? (
          <div className="flex items-center gap-3 p-3">
            {isImage ? (
              <img
                src={currentUrl}
                alt="Preview"
                className="w-14 h-14 rounded-lg object-cover border border-[rgba(11,43,38,0.1)] flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-[rgba(11,43,38,0.06)] flex items-center justify-center flex-shrink-0">
                <FiFile className="text-2xl text-[#163832]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[#163832] text-sm font-medium mb-1">
                <FiCheck className="text-[#235347]" />
                <span>File uploaded</span>
              </div>
              <p className="text-xs text-neu-muted truncate">{currentUrl.split('/').pop()?.split('?')[0]}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg text-[#051F20] hover:bg-[rgba(11,43,38,0.08)] transition-colors flex-shrink-0"
              title="Remove file"
            >
              <FiX />
            </button>
          </div>
        ) : (
          /* Upload state */
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={accept}
              className="hidden"
              disabled={isUploading}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full p-4 flex flex-col items-center justify-center gap-2 text-[#163832] hover:bg-[rgba(11,43,38,0.04)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiUploadCloud className="text-3xl text-[#235347]" />
              <span className="text-sm font-medium">
                {isUploading ? `Uploading... ${Math.round(progress)}%` : 'Click to select file'}
              </span>
              <span className="text-xs text-neu-muted">
                {isImage ? 'PNG, JPG, WebP' : 'PDF'} · Max {maxSizeMB}MB
              </span>
            </button>

            {/* Progress bar */}
            {isUploading && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[rgba(11,43,38,0.08)]">
                <div
                  className="h-full bg-[#163832] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <p className="text-xs text-[var(--error)] ml-1 mt-1">{errorMsg}</p>
      )}
    </div>
  );
};

