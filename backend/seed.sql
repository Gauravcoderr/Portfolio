-- Seed data for Gaurav Rauthan's portfolio
-- Run this in Supabase SQL Editor after schema.sql

-- Clear existing data
DELETE FROM contact_messages;
DELETE FROM admin_users;
DELETE FROM theme;
DELETE FROM skills;
DELETE FROM projects;
DELETE FROM experience;
DELETE FROM profile;

-- Profile
INSERT INTO profile (name, title, email, phone, location, bio, resume_url, avatar_url, social_links)
VALUES (
  'Gaurav Rauthan',
  'Frontend Developer | React.js | Next.js | TypeScript | JavaScript | GenAI',
  'gauravrauthan12112@gmail.com',
  '+91-9759784091',
  'Dwarka, Delhi',
  'Results-driven Frontend Developer with 3+ years of experience designing and optimizing high-performance, scalable web applications using React.js, Next.js, React Query, and Redux. Experienced in building Generative AI-powered features including conversational chatbots and intelligent resume parsing systems. Skilled in implementing SSR, CI/CD, and responsive UI architectures for business-critical platforms.',
  '',
  '',
  '{"github":"https://github.com/Gauravcoderr","linkedin":"https://linkedin.com/in/gaurav-rauthan-b96aa3227","twitter":"","email":"gauravrauthan12112@gmail.com"}'
);

-- Experience
INSERT INTO experience (company, role, location, start_date, end_date, is_current, description, tech_stack, company_url, "order") VALUES
(
  'EMB Global', 'Frontend Developer (SDE-1)', 'Gurugram', 'June 2025', NULL, TRUE,
  '["Built and maintained 5 interconnected platforms — EMBTalent (embtalent.ai), Artha (artha.emb.global), and the RA Tool suite (Client Portal, Admin Dashboard, Vendor Portal) — using Next.js 15, React 19, React Query, Tailwind CSS, and Radix UI.","Architected a GenAI-powered conversational chatbot in EMBTalent that captures client hiring requirements through natural AI dialogue, replacing static forms and reducing requirement submission time by 60%.","Built AI-driven resume extraction powered by Claude Opus that parses and structures full candidate profiles (skills, experience, education) in under 2 minutes, down from 10+ minutes manually.","Developed the RA Tool multi-portal recruitment platform: Client portal with drag-and-drop candidate pipelines; Admin dashboard with a 19-state candidate lifecycle, vendor vetting, and contract management; Vendor portal for bench profile management, receiving requirements, and submitting matching candidates.","Built the Artha financial management platform with Role & Access Control, Currency Management, PI/CI workflows, Milestone Generation modules, and Razorpay payment integration — reducing manual onboarding effort by 45%.","Integrated Intervue.io for skill-based assessments, Firebase Cloud Messaging for real-time push notifications, and Mixpanel for analytics across portals.","Improved platform SEO, Lighthouse performance scores, and Core Web Vitals across all products."]',
  '["Next.js 15","React 19","React Query","TypeScript","Tailwind CSS","Radix UI","Redux","Generative AI","dnd-kit","Razorpay"]',
  'https://emb.global', 0
),
(
  'Peregrine IT Solutions', 'Frontend Developer', 'Noida', 'February 2024', 'June 2025', FALSE,
  '["Built the Torrins music e-learning platform (torrins.com) — an online music education site with structured video lessons for Guitar, Piano, Bass, and Drums, serving 2,464+ active learners across 75+ countries with 10,000+ video lessons and 1,000+ song tutorials.","Architected responsive applications using Next.js, React.js, Redux, and Bootstrap, achieving a 35% improvement in page load efficiency.","Implemented personalized learning paths, course progression tracking, multi-angle video lessons, and subscription-based access.","Collaborated with designers and backend engineers to ship 10+ production-grade applications under tight deadlines.","Boosted rendering speed via memoization and dynamic imports, eliminating redundant re-renders across key modules."]',
  '["Next.js","React.js","Redux","Bootstrap","Material UI","JavaScript"]',
  'https://www.torrins.com', 1
),
(
  'Ahom Technologies', 'Frontend Developer', 'Gurugram', 'January 2023', 'February 2024', FALSE,
  '["Developed the frontend for the StarQuik online grocery delivery platform (starquik.com) — a client site for same-day delivery of groceries, fresh produce, dairy, and household essentials with location-based delivery slots, category navigation, and promotional banners.","Revamped enterprise UI systems with React.js and Next.js, achieving a 40% improvement in page responsiveness.","Consumed and streamlined RESTful API integrations, reducing fetch latency by 30% and enhancing platform reliability.","Drove agile sprint delivery, conducted code reviews, and introduced reusable component architecture to accelerate development by 20%."]',
  '["React.js","Next.js","HTML5","CSS3","JavaScript","PHP (Blade)","RESTful APIs"]',
  'https://www.starquik.com', 2
),
(
  'Zucol Group', 'Frontend Developer Intern', 'Gurugram', 'October 2022', 'December 2022', FALSE,
  '["Modernized legacy web interfaces using React.js and Bootstrap, increasing user engagement by 35%."]',
  '["React.js","Bootstrap","JavaScript","HTML5","CSS3"]',
  '', 3
);

-- Projects
INSERT INTO projects (title, slug, description, bullets, image_url, live_url, github_url, tech_stack, category, is_featured, "order") VALUES
(
  'Artha Platform', 'artha-platform',
  'Financial and project management platform for EMB Global with Role & Access Control, Currency Management, PI/CI workflows, and Milestone Generation.',
  '["Reduced manual onboarding effort by 45% with RBAC, Currency Management, PI/CI workflows, and Milestone Generation modules.","Integrated Razorpay for automated payment processing, cutting reconciliation time by 30%.","Enhanced SSR and caching strategies, improving performance and load times across all devices."]',
  '', 'https://artha.emb.global', '',
  '["Next.js","React Query","TypeScript","Redux","Tailwind CSS","Radix UI","Razorpay API"]',
  'professional', TRUE, 0
),
(
  'EMB Talent', 'emb-talent',
  'AI-powered B2B recruitment platform with 3 portals — Client Portal, Admin Dashboard, and Vendor Portal — where companies post hiring requirements via a conversational AI chatbot and recruiters manage the full candidate lifecycle.',
  '["[Client Portal] Hiring requirement submission via GenAI chatbot, drag-and-drop candidate pipeline (Interview → Assignment → On Hold → Rejected), JD upload with AI extraction.","[Admin Dashboard] 19-state candidate lifecycle, vendor vetting & approval, contract management, JD converter, and currency rate management.","[Vendor Portal] Multi-step onboarding, bench profile management, receiving requirements from admin, and submitting matching candidates.","GenAI resume extraction powered by Claude Opus — parses full candidate profiles in under 2 minutes (80% faster than manual).","Integrated Intervue.io skill assessments, Firebase push notifications, and Mixpanel analytics across all portals."]',
  '', 'https://embtalent.ai/', '',
  '["Next.js 15","React 19","React Query","Tailwind CSS","Radix UI","shadcn/ui","Generative AI","Claude Opus","dnd-kit","Zod","Framer Motion","Mixpanel"]',
  'professional', TRUE, 1
),
(
  'Torrins', 'torrins',
  'Online music e-learning platform offering structured instructor-led video courses for Guitar, Piano, Bass, and Drums — serving 2,464+ active learners across 75+ countries.',
  '["10,000+ video lessons and 1,000+ song tutorials in multiple languages.","Personalized learning paths with 25+ professional instructors and multi-angle video production.","Flexible subscription plans (₹1,150/month or ₹750/month annually) with progress tracking."]',
  '', 'https://www.torrins.com', '',
  '["Next.js","React.js","Redux","Bootstrap","Material UI"]',
  'professional', FALSE, 3
),
(
  'StarQuik', 'starquik',
  'Online grocery and retail delivery platform offering same-day delivery of fresh produce, groceries, dairy, and household essentials.',
  '["Location-based delivery slot selection with real-time availability tracking.","Category-based navigation, rotating promotional banners, and mobile-responsive design."]',
  '', 'https://www.starquik.com', '',
  '["HTML5","CSS3","JavaScript","PHP (Blade)"]',
  'professional', FALSE, 4
),
(
  'SNKRS Cart', 'snkrs-cart',
  'Full-stack premium sneaker e-commerce platform featuring an AI-powered KickBot shopping assistant with dual-language support and automatic lead capture.',
  '["AI-powered KickBot chatbot (Gemini 2.0 Flash + Groq fallback) with English + Hinglish support and prompt injection detection.","Comprehensive admin panel: products, orders, users, reviews, blogs (TipTap editor), banners, sellers, chat leads.","OTP-based customer auth + separate admin auth, multi-filter browsing, wishlist, order tracking, and restock alerts.","Newsletter system, seller/consignment program, and Google Shopping RSS feed across 5 brands."]',
  '', 'https://snkrs-kart.vercel.app', 'https://github.com/Gauravcoderr',
  '["Next.js 14","TypeScript","Tailwind CSS","React Query","Node.js","Express","MongoDB","Gemini AI","Groq","Cloudinary","JWT"]',
  'personal', TRUE, 5
),
(
  'SneakerAuth', 'sneakerauth',
  'AI-powered sneaker authentication service where users upload guided photos and Google Gemini Vision analyzes 50+ checkpoints to determine authenticity.',
  '["Guided photo capture with SVG ghost overlays for 8 angles (lateral, medial, top-down, heel, sole, tongue, toe box, box label).","12 analysis categories with 50+ checkpoints including stitching density, logo proportions, sole patterns, and serial number format.","Freemium model: 3 free checks/day without login, email OTP auth, 8 major brands supported.","Background async processing with frontend polling, per-check confidence scores, and PWA support."]',
  '', 'https://shoe-auth.vercel.app', 'https://github.com/Gauravcoderr',
  '["Next.js 14","TypeScript","Tailwind CSS","React Query","FastAPI","Python","MongoDB","Google Gemini","Cloudinary","JWT","PWA"]',
  'personal', TRUE, 6
),
(
  'Portfolio', 'portfolio',
  'Open-source developer portfolio with FastAPI backend, PostgreSQL (Supabase) data store, admin CMS, theme customization, and resume management.',
  '["Fully editable portfolio via admin panel with CRUD for all content sections.","Runtime theme color customization with preset palettes and live preview.","Resume upload and contact form with admin message management."]',
  '', 'https://gaurav-rauthan.vercel.app/', 'https://github.com/Gauravcoderr',
  '["Next.js 14","TypeScript","Tailwind CSS","FastAPI","PostgreSQL","Supabase"]',
  'personal', FALSE, 7
);

-- Skills
INSERT INTO skills (category, items, "order") VALUES
(
  'Frontend',
  '[{"name":"React.js","proficiency":95},{"name":"Next.js","proficiency":95},{"name":"TypeScript","proficiency":90},{"name":"JavaScript (ES6+)","proficiency":95},{"name":"Redux","proficiency":85},{"name":"React Query","proficiency":90},{"name":"Tailwind CSS","proficiency":95},{"name":"HTML5","proficiency":95},{"name":"CSS3","proficiency":95},{"name":"SCSS","proficiency":85},{"name":"Bootstrap","proficiency":85},{"name":"Material UI","proficiency":80},{"name":"Radix UI","proficiency":90},{"name":"shadcn/ui","proficiency":90},{"name":"React Hook Form","proficiency":85},{"name":"Framer Motion","proficiency":80},{"name":"dnd-kit","proficiency":85}]',
  0
),
(
  'AI / GenAI',
  '[{"name":"Generative AI","proficiency":85},{"name":"LLM Integration","proficiency":85},{"name":"Conversational AI","proficiency":85},{"name":"AI-powered Resume Parsing","proficiency":80},{"name":"Prompt Engineering","proficiency":85},{"name":"Google Gemini","proficiency":85},{"name":"Claude API","proficiency":80},{"name":"Groq","proficiency":75}]',
  1
),
(
  'Backend & DevOps',
  '[{"name":"Node.js","proficiency":80},{"name":"Express.js","proficiency":80},{"name":"FastAPI","proficiency":75},{"name":"Python","proficiency":75},{"name":"Firebase","proficiency":80},{"name":"MongoDB","proficiency":85},{"name":"PostgreSQL","proficiency":70},{"name":"RESTful APIs","proficiency":90},{"name":"JWT Authentication","proficiency":85},{"name":"Razorpay","proficiency":75},{"name":"Git","proficiency":90},{"name":"Bitbucket","proficiency":80},{"name":"Vercel","proficiency":90},{"name":"Render","proficiency":80},{"name":"GitHub Actions","proficiency":75},{"name":"Cloudinary","proficiency":80},{"name":"Supabase","proficiency":75}]',
  2
),
(
  'Other',
  '[{"name":"Responsive Web Design","proficiency":95},{"name":"Web Accessibility","proficiency":85},{"name":"Cross-device Compatibility","proficiency":90},{"name":"SEO Optimization","proficiency":85},{"name":"Core Web Vitals","proficiency":85},{"name":"Agile/Scrum","proficiency":85},{"name":"CI/CD","proficiency":80},{"name":"Mixpanel Analytics","proficiency":75},{"name":"PWA","proficiency":75}]',
  3
);

-- Theme
INSERT INTO theme (accent_color, accent_color_name, font_heading, font_body)
VALUES ('#6366f1', 'Indigo', 'Inter', 'Inter');

-- Admin user (password: admin@123)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$12$f2aDayxX2cfZjKCEXIxVnOdWZTpDc6Dy6K3Lxp48vUtuRc6Edem36');
