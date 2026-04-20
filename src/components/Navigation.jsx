import { useState, useEffect } from "react";
import { Button } from "./ui/button.jsx";
import { Menu, X, Home, Code, BookOpen, FolderOpen, GitPullRequest, FileText } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("landing");

  const navItems = [
    { id: "landing", label: "Home", icon: Home },
    { id: "techstack", label: "Tech Stack", icon: Code },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "opensource", label: "Open Source", icon: GitPullRequest },
    { id: "patents", label: "Patents", icon: FileText },
    { id: "articles", label: "Articles", icon: BookOpen },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-white">
              Nikhil Adiga
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? "text-[#146FE1] bg-[#146FE1]/10"
                        : "text-gray-400 hover:text-[#146FE1] hover:bg-[#146FE1]/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/80"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-background border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === item.id
                          ? "text-[#146FE1] bg-[#146FE1]/10"
                          : "text-gray-400 hover:text-[#146FE1] hover:bg-[#146FE1]/5"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-lg font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-[#146FE1] scale-125 shadow-[0_0_10px_#146FE1]"
                  : "bg-gray-600 hover:bg-[#146FE1]/60"
              }`}
              title={item.label}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
