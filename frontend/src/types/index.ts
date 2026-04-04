export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
}

export interface Profile {
  _id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  resume_url: string;
  avatar_url: string;
  social_links: SocialLinks;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string[];
  tech_stack: string[];
  company_url: string;
  order: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  bullets: string[];
  image_url: string;
  live_url: string;
  github_url: string;
  tech_stack: string[];
  category: "professional" | "personal";
  is_featured: boolean;
  order: number;
}

export interface SkillItem {
  name: string;
  proficiency: number;
}

export interface SkillCategory {
  _id: string;
  category: string;
  items: SkillItem[];
  order: number;
}

export interface ThemeConfig {
  _id?: string;
  accent_color: string;
  accent_color_name: string;
  font_heading: string;
  font_body: string;
}

export interface PortfolioData {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  theme: ThemeConfig;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
