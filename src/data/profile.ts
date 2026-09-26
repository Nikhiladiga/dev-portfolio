export const PROFILE = {
  name: "Nikhil Adiga",
  role: "Software Engineer",
  statement:
    "Full-stack engineer building AI-powered products, developer tools, and search systems.",
  portrait: "/nikhil.webp",
  portraitAlt: "Nikhil Adiga",
  fallbackPublicRepositories: 38,
  links: {
    github: "https://github.com/Nikhiladiga",
    linkedin: "https://in.linkedin.com/in/nikhil-adiga-493bb0183",
    medium: "https://nikhiladigaz.medium.com",
    resume: "/resume.pdf",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Open source", href: "#open-source" },
  { label: "Patent", href: "#patent" },
  { label: "Writing", href: "#writing" },
] as const;

export const STACK = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "Java",
  "Spring Boot",
  "Astro",
  "Docker",
  "AWS",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Next.js",
  "Express",
  "Git",
  "RabbitMQ",
] as const;

export const TOOLING = [
  "GitHub Actions",
  "Cloudflare Pages",
  "OpenFeature",
  "Container tooling",
] as const;
