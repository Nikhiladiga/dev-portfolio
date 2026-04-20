import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { FileText, ExternalLink } from "lucide-react";

const Patents = () => {
  const patents = [
    {
      title: "Port-to-port tunnel creation for secure remote access to networked devices",
      patentNumber: "US20240430231A1",
      description: "An innovative system and method for creating secure, port-to-port tunnels between devices on a network. It addresses the growing need for robust remote access solutions in the era of distributed systems and remote work, providing a more secure and efficient alternative to traditional VPNs. The technology allows for the seamless and encrypted connection of specific ports on source and destination devices, ensuring data integrity and confidentiality.",
      link: "https://patents.google.com/patent/US20240430231A1/en",
    },
  ];

  return (
    <section id="patents" className="py-20 bg-background border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Patents
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Innovations and intellectual property
          </p>
        </div>

        <div className="grid md:grid-cols-1 max-w-3xl mx-auto gap-8">
          {patents.map((patent, index) => (
            <Card
              key={index}
              className="group bg-transparent border-white/10 rounded-none hover:border-[#146FE1]/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-[#146FE1] transition-colors duration-300 mb-2">
                      {patent.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-400 font-mono mb-4 border border-white/10 px-2 py-1 w-max">
                      <FileText className="h-4 w-4 mr-2" />
                      Patent No: {patent.patentNumber}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-gray-400 text-lg leading-relaxed mt-2">
                  {patent.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-none border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
                  onClick={() => window.open(patent.link, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Patent
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Patents;
