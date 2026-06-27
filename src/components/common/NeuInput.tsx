import React, { forwardRef } from 'react';

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const NeuInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, NeuInputProps>(
  ({ label, error, multiline, rows = 4, className = '', ...props }, ref) => {
    const baseClasses = 'w-full bg-neu-surface text-neu-text rounded-xl p-4 border border-[#8EB69B] outline-none transition-all duration-300 focus:border-[#163832] placeholder:text-[#8EB69B] disabled:opacity-50 disabled:cursor-not-allowed';
    
    return (
      <div className={`flex flex-col gap-2 w-full ${className}`}>
        {label && (
          <label className="text-sm font-medium text-neu-text ml-2">
            {label}
          </label>
        )}
        
        {multiline ? (
          <textarea
            ref={ref as any}
            rows={rows}
            className={`${baseClasses} resize-none ${error ? 'ring-2 ring-red-400' : ''}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as any}
            className={`${baseClasses} ${error ? 'ring-2 ring-red-400' : ''}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        
        {error && (
          <span className="text-xs text-red-500 ml-2 mt-1">{error}</span>
        )}
      </div>
    );
  }
);

NeuInput.displayName = 'NeuInput';
