import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDatabase } from '../../hooks/useDatabase';
import type { Skill } from '../../types';
import { NeuCard } from '../common';

export const Skills: React.FC = () => {
  const { data: skillsData, loading, fetchCollection } = useDatabase<Skill>('skills');

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">My Skills</h2>
          <p className="text-neu-muted max-w-2xl mx-auto">Technologies and tools I work with.</p>
        </div>
        <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg animate-pulse">
          Loading skills...
        </div>
      </section>
    );
  }

  if (!skillsData || skillsData.length === 0) {
    return null;
  }

  const visibleSkills = skillsData
    .filter(s => s.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const categories = ['Frontend', 'Backend', 'Database', 'Tools', 'Programming Languages'];

  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">My Skills</h2>
        <p className="text-neu-muted max-w-2xl mx-auto">
          Technologies, frameworks, and tools I use to build digital experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {categories.map((category, index) => {
          const categorySkills = visibleSkills.filter(s => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-bold text-neu-text mb-6 pl-2 border-l-4 border-primary">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categorySkills.map(skill => (
                  <NeuCard 
                    key={skill.id} 
                    className="flex flex-col items-center justify-center p-4 text-center group h-full"
                    hoverEffect
                  >
                    <span className="font-bold text-neu-text group-hover:text-primary transition-colors text-sm">
                      {skill.name}
                    </span>
                  </NeuCard>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
