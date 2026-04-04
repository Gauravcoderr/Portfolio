export const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
export const SIMPLEICONS = "https://cdn.simpleicons.org";

type IconEntry =
  | { cdn: "devicon"; slug: string }
  | { cdn: "simple"; slug: string };

export const ICON_MAP: Record<string, IconEntry> = {
  // Frontend
  "React.js":               { cdn: "devicon", slug: "react/react-original" },
  "Next.js":                { cdn: "simple",  slug: "nextdotjs/ffffff" },
  "TypeScript":             { cdn: "devicon", slug: "typescript/typescript-original" },
  "JavaScript (ES6+)":      { cdn: "devicon", slug: "javascript/javascript-original" },
  "JavaScript":             { cdn: "devicon", slug: "javascript/javascript-original" },
  "Redux":                  { cdn: "devicon", slug: "redux/redux-original" },
  "React Query":            { cdn: "simple",  slug: "reactquery/ffffff" },
  "Tailwind CSS":           { cdn: "simple",  slug: "tailwindcss/ffffff" },
  "HTML5":                  { cdn: "devicon", slug: "html5/html5-original" },
  "CSS3":                   { cdn: "devicon", slug: "css3/css3-original" },
  "SCSS":                   { cdn: "devicon", slug: "sass/sass-original" },
  "Bootstrap":              { cdn: "devicon", slug: "bootstrap/bootstrap-original" },
  "Material UI":            { cdn: "devicon", slug: "materialui/materialui-original" },
  "Radix UI":               { cdn: "simple",  slug: "radixui/ffffff" },
  "shadcn/ui":              { cdn: "simple",  slug: "shadcnui/ffffff" },
  "React Hook Form":        { cdn: "simple",  slug: "reacthookform/ffffff" },
  "Framer Motion":          { cdn: "simple",  slug: "framer/ffffff" },
  "dnd-kit":                { cdn: "devicon", slug: "react/react-original" },
  "Zod":                    { cdn: "simple",  slug: "zod/ffffff" },
  // AI
  "Generative AI":          { cdn: "simple",  slug: "openai/ffffff" },
  "LLM Integration":        { cdn: "simple",  slug: "openai/ffffff" },
  "Conversational AI":      { cdn: "simple",  slug: "openai/ffffff" },
  "AI-powered Resume Parsing": { cdn: "simple", slug: "openai/ffffff" },
  "Prompt Engineering":     { cdn: "simple",  slug: "openai/ffffff" },
  "Google Gemini":          { cdn: "simple",  slug: "googlegemini/ffffff" },
  "Claude API":             { cdn: "simple",  slug: "anthropic/ffffff" },
  "Groq":                   { cdn: "simple",  slug: "groq/ffffff" },
  // Backend & DevOps
  "Node.js":                { cdn: "devicon", slug: "nodejs/nodejs-original" },
  "Express.js":             { cdn: "devicon", slug: "express/express-original" },
  "FastAPI":                { cdn: "devicon", slug: "fastapi/fastapi-original" },
  "Python":                 { cdn: "devicon", slug: "python/python-original" },
  "Firebase":               { cdn: "devicon", slug: "firebase/firebase-plain" },
  "MongoDB":                { cdn: "devicon", slug: "mongodb/mongodb-original" },
  "PostgreSQL":             { cdn: "devicon", slug: "postgresql/postgresql-original" },
  "MySQL":                  { cdn: "devicon", slug: "mysql/mysql-original" },
  "Redis":                  { cdn: "devicon", slug: "redis/redis-original" },
  "RESTful APIs":           { cdn: "simple",  slug: "postman/ffffff" },
  "JWT Authentication":     { cdn: "simple",  slug: "jsonwebtokens/ffffff" },
  "JWT":                    { cdn: "simple",  slug: "jsonwebtokens/ffffff" },
  "Razorpay":               { cdn: "simple",  slug: "razorpay/ffffff" },
  "Git":                    { cdn: "devicon", slug: "git/git-original" },
  "GitHub":                 { cdn: "devicon", slug: "github/github-original" },
  "Bitbucket":              { cdn: "devicon", slug: "bitbucket/bitbucket-original" },
  "Vercel":                 { cdn: "simple",  slug: "vercel/ffffff" },
  "Render":                 { cdn: "simple",  slug: "render/ffffff" },
  "GitHub Actions":         { cdn: "devicon", slug: "githubactions/githubactions-original" },
  "Cloudinary":             { cdn: "devicon", slug: "cloudinary/cloudinary-original" },
  "Supabase":               { cdn: "devicon", slug: "supabase/supabase-original" },
  "Docker":                 { cdn: "devicon", slug: "docker/docker-original" },
  "AWS":                    { cdn: "devicon", slug: "amazonwebservices/amazonwebservices-plain-wordmark" },
  "GCP":                    { cdn: "devicon", slug: "googlecloud/googlecloud-original" },
  "Figma":                  { cdn: "devicon", slug: "figma/figma-original" },
  "VS Code":                { cdn: "devicon", slug: "vscode/vscode-original" },
  // Other
  "SEO Optimization":       { cdn: "simple",  slug: "googlesearchconsole/ffffff" },
  "Core Web Vitals":        { cdn: "simple",  slug: "googlesearchconsole/ffffff" },
  "Web Accessibility":      { cdn: "devicon", slug: "html5/html5-original" },
  "Responsive Web Design":  { cdn: "devicon", slug: "css3/css3-original" },
  "Cross-device Compatibility": { cdn: "simple", slug: "googlechrome/ffffff" },
  "CI/CD":                  { cdn: "devicon", slug: "githubactions/githubactions-original" },
  "Agile/Scrum":            { cdn: "devicon", slug: "jira/jira-original" },
  "Mixpanel":               { cdn: "simple",  slug: "mixpanel/ffffff" },
  "Mixpanel Analytics":     { cdn: "simple",  slug: "mixpanel/ffffff" },
  "PWA":                    { cdn: "simple",  slug: "pwa/ffffff" },
};

export function getIconUrl(name: string): string | null {
  const entry = ICON_MAP[name];
  if (!entry) return null;
  return entry.cdn === "devicon"
    ? `${DEVICON}/${entry.slug}.svg`
    : `${SIMPLEICONS}/${entry.slug}`;
}

export function screenshotUrl(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}
