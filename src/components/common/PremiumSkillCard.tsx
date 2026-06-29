import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { Skill } from '../../types';
import { parseSkillData } from '../../lib/skillUtils';

interface PremiumSkillCardProps {
  skill: Skill;
  categoryName?: string;
  className?: string;
}

export const PremiumSkillCard: React.FC<PremiumSkillCardProps> = ({ skill, categoryName, className = '' }) => {
  const parsed = parseSkillData(skill.icon);
  const accentColor = parsed.accentColor || '#319795'; // Default teal

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl bg-neu-bg p-6 shadow-neu transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] group ${className}`}
      style={{
        boxShadow: `8px 8px 16px #c3c9d6, -8px -8px 16px #ffffff`,
      }}
    >
      {/* Optional Gradient Glow */}
      <div 
        className="absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-xl bg-neu-bg shadow-neu-inset"
            style={{ color: accentColor }}
          >
            {parsed.iconName ? (
              <Icon icon={parsed.iconName} className="text-3xl" />
            ) : parsed.customIcon ? (
              <div dangerouslySetInnerHTML={{ __html: parsed.customIcon }} className="h-8 w-8 [&>svg]:w-full [&>svg]:h-full flex items-center justify-center fill-current" />
            ) : (
              <Icon icon="lucide:code" className="text-3xl text-neu-muted" />
            )}
          </div>
          
          {parsed.featured && (
            <span 
              className="px-3 py-1 text-xs font-bold rounded-full shadow-neu-inset"
              style={{ color: accentColor }}
            >
              Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-neu-text mb-1">{skill.name || 'Skill Name'}</h3>
        <p className="text-sm font-medium text-neu-muted mb-4">{categoryName || skill.category || 'Category'}</p>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-neu-muted">Proficiency</span>
              <span style={{ color: accentColor }}>{parsed.level || 0}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-neu-bg shadow-neu-inset overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${parsed.level || 0}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </div>

          <div className="flex justify-between border-t border-neu-muted/20 pt-4">
            <div className="text-center">
              <p className="text-xs text-neu-muted font-medium mb-1">Experience</p>
              <p className="text-sm font-bold text-neu-text">{parsed.experience || '0 Yrs'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neu-muted font-medium mb-1">Projects</p>
              <p className="text-sm font-bold text-neu-text">{parsed.projects || 0}</p>
            </div>
          </div>

          {parsed.description && (
            <p className="text-sm text-neu-muted line-clamp-2 mt-4 pt-4 border-t border-neu-muted/20">
              {parsed.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
