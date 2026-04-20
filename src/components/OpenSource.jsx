import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Github, ExternalLink } from "lucide-react";

const OpenSource = () => {
  const contributions = [
    {
      title: "Typesense",
      role: "Contributor",
      description: "Contributed to Typesense, an open source, typo-tolerant search engine that is optimized for instant sub-50ms searches.",
      link: "https://github.com/typesense/typesense",
    },
    {
      title: "Ministack",
      role: "Contributor",
      description: "Contributed to Ministack, an Open-source alternative to Localstack for running aws services locally.",
      link: "https://github.com/ministackorg/ministack",
    },
  ];

  return (
    <section id="opensource" className="py-20 bg-background border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Open Source
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            My contributions to the open source community
          </p>
        </div>

        <div className="grid md:grid-cols-2 max-w-5xl mx-auto gap-8">
          {contributions.map((item, index) => (
            <Card
              key={index}
              className="bg-secondary/20 border-white/10 rounded-none hover:border-[#146FE1]/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-[#146FE1] transition-colors duration-300 mb-2">
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Github className="h-4 w-4 mr-2" />
                      {item.role}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
