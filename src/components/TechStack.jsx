import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaJava,
  FaPython,
  FaRobot,
} from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiNextdotjs,
  SiExpress,
  SiSpringboot,
  SiAstro,
  SiClaude,
  SiRabbitmq,
} from "react-icons/si";

const TechStack = () => {
  const technologies = [
    { name: "React", icon: <FaReact />, hoverColor: "group-hover:text-[#61DAFB]" },
    { name: "TypeScript", icon: <SiTypescript />, hoverColor: "group-hover:text-[#3178C6]" },
    { name: "Python", icon: <FaPython />, hoverColor: "group-hover:text-[#3776AB]" },
    { name: "Node.js", icon: <FaNodeJs />, hoverColor: "group-hover:text-[#339933]" },
    { name: "Java", icon: <FaJava />, hoverColor: "group-hover:text-[#007396]" },
    { name: "Spring Boot", icon: <SiSpringboot />, hoverColor: "group-hover:text-[#6DB33F]" },
    { name: "Astro", icon: <SiAstro />, hoverColor: "group-hover:text-[#FF5D01]" },
    { name: "Claude Code", icon: <SiClaude />, hoverColor: "group-hover:text-[#D8C2AD]" },
    { name: "Antigravity", icon: <FaRobot />, hoverColor: "group-hover:text-[#4285F4]" },
    { name: "Docker", icon: <FaDocker />, hoverColor: "group-hover:text-[#2496ED]" },
    { name: "AWS", icon: <FaAws />, hoverColor: "group-hover:text-[#FF9900]" },
    { name: "PostgreSQL", icon: <SiPostgresql />, hoverColor: "group-hover:text-[#4169E1]" },
    { name: "MongoDB", icon: <SiMongodb />, hoverColor: "group-hover:text-[#47A248]" },
    { name: "Redis", icon: <SiRedis />, hoverColor: "group-hover:text-[#DC382D]" },
    { name: "Next.js", icon: <SiNextdotjs />, hoverColor: "group-hover:text-white" },
    { name: "Express", icon: <SiExpress />, hoverColor: "group-hover:text-white" },
    { name: "Git", icon: <FaGitAlt />, hoverColor: "group-hover:text-[#F05032]" },
    { name: "RabbitMQ", icon: <SiRabbitmq />, hoverColor: "group-hover:text-[#FF6600]" },
  ];

  return (
    <section id="techstack" className="py-20 bg-background border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Tech Stack
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {technologies.map((tech) => (
            <div key={tech.name} className="group relative">
              <div className="bg-transparent border border-white/10 rounded-none p-6 text-center transition-all duration-300 hover:border-[#146FE1]/50 hover:bg-[#146FE1]/5 flex flex-col items-center justify-center min-h-[120px] hover:-translate-y-1">
                <div className={`text-3xl mb-3 text-gray-400 ${tech.hoverColor} transition-colors duration-300`}>
                  {tech.icon}
                </div>
                <h3 className={`text-xs font-medium text-gray-500 ${tech.hoverColor} tracking-wider uppercase transition-colors duration-300`}>
                  {tech.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
