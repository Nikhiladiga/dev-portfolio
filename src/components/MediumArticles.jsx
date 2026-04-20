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
    const fetchArticles = async () => {
      try {
        setLoading(true);
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const items = data.items.map((item) => ({
              title: item.title,
              link: item.link,
              tags: item.categories || [],
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
      <section id="articles" className="py-20 bg-background border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
              Articles
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[...Array(2)].map((_, i) => (
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
      <section id="articles" className="py-20 bg-background border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Articles
          </h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="py-20 bg-background border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Articles
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Thoughts, insights, and tutorials from my journey in tech
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="group bg-transparent border-white/10 rounded-none hover:border-[#146FE1]/50 transition-all duration-300 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 opacity-70" />
                    {formatDate(article.pubDate)}
                  </div>
                </div>
                <CardTitle className="text-2xl text-white group-hover:text-[#146FE1] transition-colors duration-300 mb-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs border-white/10 text-gray-400 rounded-none font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-none border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
                  asChild
                >
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Read Article
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="rounded-none border-white/20 text-white hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300" asChild>
            <a
              href="https://medium.com/@nikhiladigaz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              View Medium Profile
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MediumArticles;
