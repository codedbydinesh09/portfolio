import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { NeuCard, NeuButton } from '../common';
import { useDatabase } from '../../hooks/useDatabase';
import type { Project } from '../../types';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const { data: projectsData, fetchCollection } = useDatabase<Project>('projects');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!projectsData) return null;
  
  const visibleProjects = projectsData
    .filter(p => p.isVisible)
    .sort((a, b) => a.order - b.order);

  const categories = ['All', ...Array.from(new Set(visibleProjects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'All' 
    ? visibleProjects 
    : visibleProjects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">Featured Projects</h2>
          <p className="text-neu-muted max-w-2xl mx-auto">Explore my latest work, side projects, and open source contributions.</p>
        </motion.div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <NeuButton 
              key={cat}
              variant={activeCategory === cat ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-6"
            >
              {cat}
            </NeuButton>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <NeuCard 
                  className="h-full flex flex-col group cursor-pointer" 
                  hoverEffect
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden shadow-neu-inset mb-6">
                    <img 
                      src={project.featuredImage || 'https://via.placeholder.com/600x400'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-neu-bg/90 backdrop-blur-sm text-xs font-medium rounded-full shadow-sm text-primary">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-neu-text mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-neu-muted line-clamp-3 mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack?.slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-1 text-xs shadow-neu-inset rounded-md text-neu-muted">
                        {tech}
                      </span>
                    ))}
                    {project.techStack?.length > 4 && (
                      <span className="px-2 py-1 text-xs shadow-neu-inset rounded-md text-neu-muted">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-neu-muted/20">
                    {project.githubUrl && (
                      <NeuButton 
                        variant="icon" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); window.open(project.githubUrl, '_blank'); }}
                        aria-label="GitHub Repo"
                      >
                        <FiGithub />
                      </NeuButton>
                    )}
                    {project.liveUrl && (
                      <NeuButton 
                        variant="primary" 
                        className="flex-1 gap-2 text-sm"
                        onClick={(e) => { e.stopPropagation(); window.open(project.liveUrl, '_blank'); }}
                      >
                        Live Demo <FiExternalLink />
                      </NeuButton>
                    )}
                  </div>
                </NeuCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-neu-muted">
            No projects found in this category.
          </div>
        )}
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
};
