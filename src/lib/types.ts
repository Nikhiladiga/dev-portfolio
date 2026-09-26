export interface RepositoryStats {
  stars: number;
  forks: number;
  watchers: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  repository: string;
  repositoryUrl: string;
  demoUrl?: string;
  technologies: string[];
  order: number;
  showStats: boolean;
  stats?: RepositoryStats;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  pubDate: Date;
  tags: string[];
  readingMinutes?: number;
}

export interface OpenSourceWork {
  id: string;
  title: string;
  role: string;
  description: string;
  url: string;
  order: number;
}

export interface Patent {
  id: string;
  title: string;
  number: string;
  description: string;
  url: string;
  order: number;
}

export interface PortfolioStats {
  publicRepositories: number;
  patents: number;
  openSourceProjects: number;
  articles: number;
}
