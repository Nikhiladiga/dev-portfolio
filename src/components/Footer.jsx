import { Button } from "./ui/button";
import { Github, Linkedin, Heart, ArrowUp } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/Nikhiladiga", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://in.linkedin.com/in/nikhil-adiga-493bb0183",
      label: "LinkedIn",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  key={index}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-[#146FE1] transition-all duration-300 hover:scale-110"
                  title={link.label}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                </Button>
              );
            })}
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-white">
              Let's Connect
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Always interested in new opportunities and collaborations. Feel
              free to reach out if you'd like to work together!
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                2024 Nikhil Adiga. Built with{" "}
                <Heart className="inline h-4 w-4 text-gray-600 mx-1" />
                using React & Vite
              </p>

              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="text-gray-400 hover:text-[#146FE1] transition-all duration-300"
              >
                Back to Top
                <ArrowUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
