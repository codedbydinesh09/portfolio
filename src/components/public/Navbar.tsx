import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiUser, FiCode, FiBriefcase, FiMail } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      let current = 'home';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', icon: <FiHome />, label: 'Home' },
    { id: 'about', icon: <FiUser />, label: 'About' },
    { id: 'skills', icon: <FiCode />, label: 'Skills' },
    { id: 'projects', icon: <FiBriefcase />, label: 'Projects' },
    { id: 'contact', icon: <FiMail />, label: 'Contact' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full shadow-neu bg-[#051F20]/95 backdrop-blur-md border border-[rgba(11,43,38,0.08)]"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`relative p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeSection === item.id 
              ? 'text-[#051F20]' 
              : 'text-[#8EB69B] hover:text-[#DAF1DE]'
          }`}
          aria-label={item.label}
        >
          <span className="text-xl relative z-10">{item.icon}</span>
          {activeSection === item.id && (
            <motion.div
              layoutId="activeNavIndicator"
              className="absolute inset-0 rounded-full bg-[#DAF1DE] shadow-[inset_0_2px_4px_rgba(5,31,32,0.04)]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
};
