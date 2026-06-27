import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  description?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ isOpen, onClose, imageUrl, description }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          className="absolute top-6 right-6 text-white hover:text-primary transition-colors bg-black/50 p-2 rounded-full"
          onClick={onClose}
          aria-label="Close Lightbox"
        >
          <FiX size={24} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-full max-h-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={description || 'Expanded Image'}
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
          {description && (
            <div className="mt-4 text-white text-center max-w-3xl bg-black/50 p-4 rounded-xl">
              <p className="text-lg">{description}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
