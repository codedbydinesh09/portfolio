import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
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
        
        {/* About Section Placeholder */}
        <section id="about" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">About Me</h2>
             <p className="text-neu-muted max-w-2xl mx-auto">Learn more about my background and skills.</p>
          </div>
          <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg">
            About section coming soon.
          </div>
        </section>
        
        {/* Skills Section Placeholder */}
        <section id="skills" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">My Skills</h2>
             <p className="text-neu-muted max-w-2xl mx-auto">Technologies and tools I work with.</p>
          </div>
          <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg">
            Skills section coming soon.
          </div>
        </section>

        <Projects />

        {/* Contact Section Placeholder */}
        <section id="contact" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-bold text-neu-text mb-4">Get In Touch</h2>
             <p className="text-neu-muted max-w-2xl mx-auto">Have a project in mind? Let's talk.</p>
          </div>
          <div className="p-12 shadow-neu rounded-3xl text-center text-neu-muted bg-neu-bg">
            Contact form will be implemented here.
          </div>
        </section>
      </main>
      
      <footer className="py-8 text-center text-neu-muted text-sm border-t border-neu-muted/20">
        <p>&copy; {new Date().getFullYear()} Dinesh. All rights reserved.</p>
      </footer>
    </>
  );
};
