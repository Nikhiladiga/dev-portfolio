import { Button } from "./ui/button.jsx";
import { Download } from "lucide-react";
import nikhil from "../assets/nikhil.png";

const Landing = () => {
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/dev-portfolio/resume.pdf";
    link.download = "Nikhil_Adiga_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id="landing"
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-24 md:pt-0"
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border border-white/20 p-1">
                <img
                  src={nikhil}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white tracking-tight">
            Nikhil Adiga
          </h1>
          <h2 className="text-2xl md:text-4xl text-gray-300 mb-8 font-light tracking-wide">
            Software Engineer
          </h2>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Crafting the future through code. Passionate about building
            innovative solutions that bridge the gap between imagination and
            reality.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleDownloadResume}
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 mb-16 rounded-none border border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Resume
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
