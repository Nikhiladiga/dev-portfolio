import { Button } from "./ui/button";
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/Nikhiladiga", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://in.linkedin.com/in/nikhil-adiga-493bb0183",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:john@example.com", label: "Email" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-background border-t border-blue-500/20 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 hover:scale-110"
                  onClick={() => window.open(link.href, "_blank")}
                  title={link.label}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Let's Connect
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Always interested in new opportunities and collaborations. Feel
              free to reach out if you'd like to work together!
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 Nikhil Adiga. Built with{" "}
                <Heart className="inline h-4 w-4 text-red-400 mx-1" />
                using React & Vite
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300"
              >
                Back to Top
                <ArrowUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
