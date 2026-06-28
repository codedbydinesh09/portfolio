import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowRight, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { NeuButton } from '../common';
import { useDatabase } from '../../hooks/useDatabase';
import type { HeroContent, Settings } from '../../types';

export const Hero: React.FC = () => {
  const { data: heroData, fetchCollection: fetchHero } = useDatabase<HeroContent>('profile');
  const { data: settingsData, fetchCollection: fetchSettings } = useDatabase<Settings>('profile');
  
  const [currentWord, setCurrentWord] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  
  useEffect(() => {
    fetchHero();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hero = heroData?.[0];
  const settings = settingsData?.[0];

  // Typing animation effect
  useEffect(() => {
    if (!hero?.typingWords?.length) return;
    
    const word = hero.typingWords[currentWord];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(word.substring(0, text.length + 1));
        if (text === word) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setText(word.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % hero.typingWords.length);
        }
      }
    }, isDeleting ? 50 : 150);
    
    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentWord, hero]);

  if (!hero) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 pb-32 overflow-hidden">
      {/* Particle Background Placeholder - In real implementation use tsParticles or raw canvas */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
         <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-2 rounded-full shadow-neu-inset text-sm font-medium text-primary">
            {hero.greeting || "Hello, I am"}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neu-text">
            {hero.name || "Dinesh"}
          </h1>
          
          <div className="h-12 md:h-16 text-2xl md:text-3xl font-medium text-neu-muted flex items-center">
            <span>I'm a <span className="text-primary">{text}</span></span>
            <span className="w-1 h-8 bg-primary ml-1 animate-ping" />
          </div>
          
          <p className="text-lg text-neu-muted max-w-lg leading-relaxed">
            {hero.shortIntro || "Building premium, modern web applications with a focus on UI/UX and scalable architectures."}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <NeuButton 
              variant="primary" 
              className="gap-2"
              onClick={() => {
                if (hero.resumeUrl) window.open(hero.resumeUrl, '_blank');
              }}
            >
              <FiDownload /> Resume
            </NeuButton>
            
            <NeuButton 
              variant="secondary" 
              className="gap-2 group"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Projects <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </NeuButton>
          </div>
          
          <div className="flex items-center gap-4 pt-8 border-t border-neu-muted/20 w-max">
            {settings?.socialLinks?.github && (
              <NeuButton variant="icon" onClick={() => window.open(settings.socialLinks.github, '_blank')}>
                <FiGithub />
              </NeuButton>
            )}
            {settings?.socialLinks?.linkedin && (
              <NeuButton variant="icon" onClick={() => window.open(settings.socialLinks.linkedin, '_blank')}>
                <FiLinkedin />
              </NeuButton>
            )}
            {settings?.socialLinks?.twitter && (
              <NeuButton variant="icon" onClick={() => window.open(settings.socialLinks.twitter, '_blank')}>
                <FiTwitter />
              </NeuButton>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Photo or initials fallback — no border, no ring, blends into #DAF1DE background */}
          <div
            className="relative"
            style={{
              width: 'min(42vw, 480px)',
              height: 'min(42vw, 480px)',
              minWidth: '280px',
              minHeight: '280px',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            }}
          >
            {hero.profilePhotoUrl ? (
              <img
                src={hero.profilePhotoUrl}
                alt={hero.name || 'Profile'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                  mixBlendMode: 'multiply',
                  WebkitMaskImage: 'radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%)',
                }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  el.parentElement!.innerHTML = `<div style="width:100%;height:100%;background:#DAF1DE;display:flex;align-items:center;justify-content:center;font-size:8rem;font-weight:700;color:#163832;-webkit-mask-image:radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%);mask-image:radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%);">${(hero.name || 'D').charAt(0).toUpperCase()}</div>`;
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#DAF1DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8rem',
                  fontWeight: 700,
                  color: '#163832',
                  WebkitMaskImage: 'radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 75% 100% at 50% 0%, black 70%, transparent 100%)',
                }}
              >
                {(hero.name || 'D').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
