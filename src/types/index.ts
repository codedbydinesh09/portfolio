export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface Settings {
  siteName: string;
  theme: 'light' | 'dark';
  seoTitle: string;
  seoDescription: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export interface HeroContent {
  greeting: string;
  name: string;
  subtitle: string;
  shortIntro: string;
  typingWords: string[];
  resumeUrl: string;
  profilePhotoUrl: string;
}

export interface AboutContent {
  description: string;
  careerGoal: string;
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Programming Languages';
  icon: string; // React Icons name or URL
  order: number;
  isVisible: boolean;
}

export interface ProjectImage {
  url: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  images: (string | ProjectImage)[];
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  category: string;
  status: 'Completed' | 'In Progress' | 'Planned';
  order: number;
  isVisible: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imageUrl: string;
  credentialUrl?: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: number;
  read: boolean;
}
