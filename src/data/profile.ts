export const PROFILE = {
  name: "Nikhil Adiga",
  role: "Software Engineer",
  statement:
    "Full-stack engineer building AI-powered products, developer tools, and search systems.",
  portrait: "/nikhil.webp",
  portraitAlt: "Nikhil Adiga",
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
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Open source", href: "#open-source" },
  { label: "Patent", href: "#patent" },
  { label: "Writing", href: "#writing" },
] as const;

export const EXPERIENCE = [
  {
    company: "Typesense",
    role: "Developer Experience Engineer",
    dates: "Starting Nov 2026",
    startYear: "2026",
    summary: "Making Typesense faster to adopt for developers and easier to discover and use through AI agents.",
    highlights: [
      "Reduce time to first search with CLI tooling such as create-typesense-app.",
      "Improve Typesense's agentic SEO and developer experience with polished skills and plugins for agentic harnesses, while representing Typesense at developer conferences across India.",
    ],
    technologies: ["Typesense", "CLI", "Agentic SEO", "Developer Tooling"],
  },
  {
    company: "Vinyl Equity",
    role: "Senior Software Engineer - L4",
    dates: "Jan 2025 - Present",
    startYear: "2025",
    summary: "Leading product architecture and pragmatic AI adoption across engineering workflows.",
    highlights: [
      "Architected high-throughput data ingestion with real-time SSE telemetry, queues, and serverless functions.",
      "Built resilient email infrastructure with SendGrid, SES, SQS, Lambda, DynamoDB, and a versioned visual template editor.",
    ],
    technologies: ["AI", "SSE", "AWS", "Serverless"],
  },
  {
    company: "Sclera",
    role: "Lead Software Engineer",
    dates: "Aug 2022 - Dec 2024",
    startYear: "2022",
    summary: "Designed scalable product systems while mentoring engineers and guiding technical direction.",
    highlights: [
      "Built a Typesense search API capable of searching millions of products efficiently.",
      "Automated floorplan image analysis with a serverless pipeline, reducing manual work by 70%.",
    ],
    technologies: ["Typesense", "RAG", "Docker", "RabbitMQ"],
  },
  {
    company: "Access Research Labs",
    role: "Senior Software Engineer",
    dates: "Jan 2020 - Aug 2022",
    startYear: "2020",
    summary: "Built network-management products spanning desktop, web, APIs, infrastructure, and mobile leadership.",
    highlights: [
      "Co-developed the patented P2P protocol behind direct, port-forwarding-free remote hardware access.",
      "Cut deployment time by 40% and container image size by 82% while onboarding massive Excel datasets.",
    ],
    technologies: ["React", "Spring Boot", "JavaFX", "Docker"],
  },
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
