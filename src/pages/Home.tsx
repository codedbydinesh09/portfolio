import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Skills } from '../components/public/Skills';
import { Projects } from '../components/public/Projects';

export const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dinesh | Portfolio</title>
        <meta name="description" content="Portfolio of Dinesh, a Full Stack Developer." />
      </Helmet>

      <Navbar />

      <main>
        <Hero />
        
        <About />
        
        <Skills />

        <Projects />

        {/* Thank You Section */}
        <section id="contact" className="py-24 max-w-4xl mx-auto px-6">
          <div className="p-12 shadow-neu rounded-3xl text-center bg-neu-bg">
            <p className="text-xl md:text-2xl font-bold text-neu-text leading-relaxed">
              Thank you for taking the time to review my portfolio. I appreciate your interest and look forward to opportunities to collaborate and contribute.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-neu-muted text-sm border-t border-neu-muted/20">
        <p>&copy; {new Date().getFullYear()} Dinesh. All rights reserved.</p>
      </footer>
    </>
  );
};
