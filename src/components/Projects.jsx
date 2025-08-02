import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Button } from "./ui/button.jsx";
import { ExternalLink, Github, Star, GitFork, Eye } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pinnedRepoNames = [
    "google-street-view-clone",
    "ios-http-server",
    "react-speedtest",
    "webkitgtk-kiosk-app",
  ];

  useEffect(() => {
    // Simulate API call to fetch GitHub repositories
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch from GitHub API
        const response = await fetch(
          "https://api.github.com/users/Nikhiladiga/repos?sort=updated&per_page=10"
        );
        const data = await response.json();
        const pinnedProjects = data.filter((repo) =>
          pinnedRepoNames.includes(repo.name)
        );
        setProjects(pinnedProjects);
      } catch (err) {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "from-yellow-400 to-orange-500",
      TypeScript: "from-blue-500 to-blue-600",
      Python: "from-green-400 to-blue-500",
      Solidity: "from-gray-600 to-gray-800",
      Java: "from-red-500 to-orange-600",
      Go: "from-cyan-400 to-blue-500",
    };
    return colors[language] || "from-gray-500 to-gray-600";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section
        id="projects"
        className="py-20 bg-gradient-to-br from-gray-900 via-green-900/20 to-blue-900/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Featured Projects
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="bg-card/50 backdrop-blur-sm border-green-500/20 animate-pulse"
              >
                <CardHeader>
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="projects"
        className="py-20 bg-gradient-to-br from-gray-900 via-green-900/20 to-blue-900/20"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-gray-900 via-green-900/20 to-blue-900/20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A showcase of my latest work and contributions to the open-source
            community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="group bg-card/50 backdrop-blur-sm border-green-500/20 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getLanguageColor(
                      project.language
                    )} text-white`}
                  >
                    {project.language}
                  </div>
                  <div className="text-xs text-gray-400">
                    Updated {formatDate(project.updated_at)}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-green-300 transition-colors duration-300 flex items-center">
                  {project.name}
                  <Github className="ml-2 h-4 w-4 opacity-60" />
                </CardTitle>
                <CardDescription className="text-gray-300 line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      {project.stargazers_count}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1 text-blue-400" />
                      {project.forks_count}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-green-400" />
                      {project.watchers_count}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.topics.slice(0, 3).map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="tech" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {project.topics.length > 3 && (
                    <Badge variant="tech" className="text-xs">
                      +{project.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 group-hover:bg-green-500/20 group-hover:border-green-400 transition-all duration-300"
                    onClick={() => window.open(project.html_url, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                  {project.homepage && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:bg-blue-500/20 group-hover:border-blue-400 transition-all duration-300"
                      onClick={() => window.open(project.homepage, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="futuristic"
            size="lg"
            onClick={() => window.open("https://github.com/johndoe", "_blank")}
          >
            View All Projects on GitHub
            <Github className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Projects;
