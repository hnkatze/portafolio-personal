// === Bilingual ===
export interface BilingualText {
  es: string;
  en: string;
}
export type Lang = 'es' | 'en';

// === Personal Info ===
export interface PersonalInfo {
  name: string;
  title: BilingualText;
  summary: BilingualText;
  email: string;
  location: string;
  photo: string;
  socials: {
    github: string;
    linkedin: string;
    discord?: string;
  };
}

// === Skills ===
export type SkillCategory = 'frontend' | 'backend' | 'tools';
export type SkillLevel = 'expert' | 'proficient' | 'familiar';

export interface Skill {
  name: string;
  level: SkillLevel;
  icon: string;
  category: SkillCategory;
  favorite?: boolean;
}

// === Projects ===
export interface Project {
  title: string;
  description: BilingualText;
  image?: string;
  technologies: string[];
  projectUrl?: string;
  repoUrl?: string;
}

// === Experience ===
export interface Experience {
  role: BilingualText;
  company: string;
  startDate: string;
  endDate: string;
  description: BilingualText;
  highlights: BilingualText[];
}

// === Education ===
export type EducationStatus = 'completed' | 'in_progress';

export interface Education {
  degree: BilingualText;
  institution: string;
  status: EducationStatus;
  highlights?: string[];
}

// === Certifications ===
export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

// === Languages ===
export interface Language {
  name: BilingualText;
  level: BilingualText;
}

// === Integration Config ===
export interface IntegrationConfig {
  github: {
    username: string;
    statsTheme: string;
  };
  discord?: {
    userId: string;
  };
  linkedin: {
    profileUrl: string;
  };
}

// === Testimonials ===
export interface Testimonial {
  name: string;
  role: BilingualText;
  project: string;
  quote: BilingualText;
  avatar?: string;
}

// === Contact Form ===
export interface PropsFormData {
  name: string;
  email: string;
  title: string;
  message: string;
}
