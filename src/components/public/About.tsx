import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiTarget } from 'react-icons/fi';
import { useDatabase } from '../../hooks/useDatabase';
import type { AboutContent } from '../../types';

export const About: React.FC = () => {
  const { data, loading, fetchCollection } = useDatabase<AboutContent>('profile');

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const about = data?.[0];

  if (loading) {
    return (
      <section id="about" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">About Me</h2>
        </div>
        <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg animate-pulse">
          Loading...
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section id="about" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">About Me</h2>
          <p className="text-neu-muted max-w-2xl mx-auto">Learn more about my background and skills.</p>
        </div>
        <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg">
          About section coming soon.
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">About Me</h2>
        <p className="text-neu-muted max-w-2xl mx-auto">
          Get to know me better — my story, passions, and what drives me.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main description card */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 p-8 rounded-3xl shadow-neu bg-neu-bg"
        >
          <h3 className="text-xl font-bold text-neu-text mb-4 flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              👋
            </span>
            Who I Am
          </h3>
          <p className="text-neu-muted leading-relaxed text-base whitespace-pre-line">
            {about.description}
          </p>
        </motion.div>

        {/* Info & Social card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Personal info */}
          <div className="p-6 rounded-3xl shadow-neu bg-neu-bg flex-1">
            <h3 className="text-lg font-bold text-neu-text mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {about.email && (
                <li className="flex items-center gap-3 text-neu-muted">
                  <FiMail className="text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${about.email}`}
                    className="hover:text-primary transition-colors truncate"
                  >
                    {about.email}
                  </a>
                </li>
              )}
              {about.location && (
                <li className="flex items-center gap-3 text-neu-muted">
                  <FiMapPin className="text-primary flex-shrink-0" />
                  <span>{about.location}</span>
                </li>
              )}
            </ul>

            {/* Social Links */}
            {(about.githubUrl || about.linkedinUrl) && (
              <div className="mt-5 pt-5 border-t border-neu-muted/20">
                <p className="text-xs uppercase tracking-widest text-neu-muted mb-3">Find me on</p>
                <div className="flex items-center gap-3">
                  {about.githubUrl && (
                    <a
                      href={about.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="w-10 h-10 rounded-xl shadow-neu flex items-center justify-center text-neu-muted hover:text-primary hover:shadow-neu-inset transition-all duration-200"
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {about.linkedinUrl && (
                    <a
                      href={about.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="w-10 h-10 rounded-xl shadow-neu flex items-center justify-center text-neu-muted hover:text-primary hover:shadow-neu-inset transition-all duration-200"
                    >
                      <FiLinkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Career Goal card */}
      {about.careerGoal && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 p-8 rounded-3xl shadow-neu bg-neu-bg"
        >
          <h3 className="text-xl font-bold text-neu-text mb-4 flex items-center gap-2">
            <FiTarget className="text-primary" />
            Career Goals
          </h3>
          <p className="text-neu-muted leading-relaxed whitespace-pre-line">{about.careerGoal}</p>
        </motion.div>
      )}
    </section>
  );
};
