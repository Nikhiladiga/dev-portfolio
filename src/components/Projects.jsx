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
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.github.com/users/Nikhiladiga/repos?sort=updated&per_page=100"
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response");
        }

        const sortedProjects = [...data].sort((a, b) => {
          const aPinned = pinnedRepoNames.includes(a.name);
          const bPinned = pinnedRepoNames.includes(b.name);
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;

          const aStars = a.stargazers_count;
          const bStars = b.stargazers_count;
          if (aStars > 10 && bStars <= 10) return -1;
          if (aStars <= 10 && bStars > 10) return 1;

          const aFeatured = a.topics?.includes("featured");
          const bFeatured = b.topics?.includes("featured");
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;

          return 0;
        });

        // ONLY 6 PROJECTS NOW
        setProjects(sortedProjects.slice(0, 6));
      } catch (err) {
        setError("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
              Projects
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-transparent border-white/10 rounded-none animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-white/10 rounded-none w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/5 rounded-none w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-white/5 rounded-none w-full mb-2"></div>
                  <div className="h-3 bg-white/5 rounded-none w-2/3"></div>
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
      <section id="projects" className="py-20 bg-background border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Projects
          </h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Projects
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            A showcase of my latest work and contributions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group bg-transparent border-white/10 rounded-none hover:border-[#146FE1]/50 transition-all duration-300 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="px-2 py-1 border border-white/20 text-xs text-gray-400">
                    {project.language || "Code"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(project.updated_at)}
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-[#146FE1] transition-colors duration-300 flex items-center">
                  {project.name}
                  <Github className="ml-2 h-4 w-4 opacity-50" />
                </CardTitle>
                <CardDescription className="text-gray-400 line-clamp-3 mt-2 flex-grow">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500 border-t border-white/10 pt-4 mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 opacity-70" />
                      {project.stargazers_count}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1 opacity-70" />
                      {project.forks_count}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 opacity-70" />
                      {project.watchers_count}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.topics?.slice(0, 3).map((topic, topicIndex) => (
                    <Badge key={topicIndex} variant="outline" className="text-xs border-white/10 text-gray-400 rounded-none font-normal">
                      {topic}
                    </Badge>
                  ))}
                  {project.topics?.length > 3 && (
                    <Badge variant="outline" className="text-xs border-white/10 text-gray-400 rounded-none font-normal">
                      +{project.topics.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-none border-white/20 text-gray-300 hover:bg-white hover:text-black transition-all duration-300"
                    onClick={() => window.open(project.html_url, "_blank")}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                  {project.homepage && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-none border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
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

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="rounded-none border-white/20 text-white hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
            onClick={() => window.open("https://github.com/Nikhiladiga", "_blank")}
          >
            View GitHub Profile
            <Github className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
