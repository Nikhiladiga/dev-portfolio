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
import { ExternalLink, Calendar, Clock } from "lucide-react";

const url = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@nikhiladigaz`;

const MediumArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch Medium articles
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch from Medium RSS feed
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            console.log("Data:", data);
            const items = data.items.map((item) => ({
              title: item.title,
              link: item.link,
              tags: item.categories,
              pubDate: item.pubDate,
            }));
            setArticles(items);
          });
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section
        id="articles"
        className="py-20 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Latest Articles
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="bg-card/50 backdrop-blur-sm border-blue-500/20 animate-pulse"
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
        id="articles"
        className="py-20 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="articles"
      className="py-20 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thoughts, insights, and tutorials from my journey in tech
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="group bg-card/50 backdrop-blur-sm border-blue-500/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(article.pubDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-purple-300 transition-colors duration-300">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-gray-300 line-clamp-3">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="tech" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-purple-500/20 group-hover:border-purple-400 transition-all duration-300"
                  onClick={() => window.open(article.link, "_blank")}
                >
                  Read Article
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="futuristic"
            size="lg"
            onClick={() =>
              window.open("https://medium.com/@nikhiladigaz", "_blank")
            }
          >
            View All Articles on Medium
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default MediumArticles;
