import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiMaximize2 } from 'react-icons/fi';
import type { Project } from '../../types';
import { NeuButton } from '../common';
import { ImageLightbox } from './ImageLightbox';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [lightboxImage, setLightboxImage] = useState<{url: string, desc: string} | null>(null);

  if (!isOpen || !project) return null;

  const allImages = [
    { url: project.featuredImage, description: 'Featured Image' },
    ...project.images.map(img => 
      typeof img === 'string' 
        ? { url: img, description: '' } 
        : { url: img.url, description: img.description || '' }
    )
  ];

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-neu-bg/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            className="w-full max-w-5xl max-h-full overflow-y-auto bg-neu-bg rounded-3xl shadow-neu flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-neu-muted/20 sticky top-0 bg-neu-bg z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-neu-text pr-4">{project.title}</h2>
              <button 
                onClick={onClose}
                className="p-3 bg-neu-bg text-neu-muted hover:text-primary rounded-full shadow-neu hover:shadow-neu-inset transition-all"
                aria-label="Close Modal"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col gap-8">
              
              {/* Horizontal Image Gallery */}
              <div className="w-full">
                <h3 className="text-lg font-bold text-neu-text mb-4">Gallery</h3>
                <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative min-w-[280px] md:min-w-[400px] h-48 md:h-64 rounded-xl overflow-hidden shadow-neu shrink-0 snap-center group cursor-pointer"
                      onClick={() => setLightboxImage({ url: img.url, desc: img.description })}
                    >
                      <img 
                        src={img.url} 
                        alt={img.description || `Gallery image ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FiMaximize2 className="text-white text-3xl" />
                      </div>
                      {img.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-sm line-clamp-2">{img.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-neu-text">About the Project</h3>
                  <div className="p-6 md:p-8 bg-neu-bg shadow-neu-inset rounded-2xl">
                    <p className="text-neu-muted leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-neu-text mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack?.map(tech => (
                        <span key={tech} className="px-3 py-1.5 text-sm shadow-neu-inset rounded-lg text-neu-muted font-medium bg-neu-bg">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-neu-text mb-4">Links</h3>
                    <div className="flex flex-col gap-4">
                      {project.githubUrl && (
                        <NeuButton 
                          variant="secondary" 
                          className="w-full justify-center gap-3"
                          onClick={() => window.open(project.githubUrl, '_blank')}
                        >
                          <FiGithub size={20} /> View Source Code
                        </NeuButton>
                      )}
                      {project.liveUrl && (
                        <NeuButton 
                          variant="primary" 
                          className="w-full justify-center gap-3"
                          onClick={() => window.open(project.liveUrl, '_blank')}
                        >
                          <FiExternalLink size={20} /> Live Demo
                        </NeuButton>
                      )}
                    </div>
                  </div>
                  
                  <div>
                     <h3 className="text-lg font-bold text-neu-text mb-2">Category</h3>
                     <p className="text-neu-muted capitalize inline-block px-4 py-2 shadow-neu rounded-xl">{project.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <ImageLightbox 
        isOpen={!!lightboxImage} 
        onClose={() => setLightboxImage(null)} 
        imageUrl={lightboxImage?.url || ''} 
        description={lightboxImage?.desc}
      />
    </>
  );
};
