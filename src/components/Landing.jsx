import { Button } from "./ui/button.jsx";
import { Download, ChevronDown } from "lucide-react";
import nikhil from "../assets/nikhil.png";

const Landing = () => {
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Nikhil_Adiga_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToNext = () => {
    const nextSection = document.getElementById("techstack");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="landing"
      className="min-h-screen flex items-center justify-center futuristic-bg tech-grid relative overflow-hidden pt-24 md:pt-0"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 animate-glow">
                <img
                  src={nikhil}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-xl"></div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-glow bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Nikhil Adiga
          </h1>
          <h2 className="text-2xl md:text-4xl text-blue-300 mb-8 font-light tracking-wide">
            Software Engineer
          </h2>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Crafting the future through code. Passionate about building
            innovative solutions that bridge the gap between imagination and
            reality.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleDownloadResume}
            variant="futuristic"
            size="lg"
            className="text-lg px-8 py-4 mb-16"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </Button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={scrollToNext}
              className="animate-bounce text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ChevronDown className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
