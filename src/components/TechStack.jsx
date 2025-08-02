import {
  FaReact,
  FaJs,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaJava,
} from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiNextdotjs,
  SiExpress,
  SiSpringboot,
} from "react-icons/si";

const TechStack = () => {
  const technologies = [
    { name: "React", icon: <FaReact />, color: "from-blue-400 to-cyan-400" },
    {
      name: "JavaScript",
      icon: <FaJs />,
      color: "from-yellow-400 to-orange-400",
    },
    {
      name: "TypeScript",
      icon: <SiTypescript />,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Node.js",
      icon: <FaNodeJs />,
      color: "from-green-400 to-green-500",
    },
    { name: "Java", icon: <FaJava />, color: "from-red-500 to-red-600" },
    {
      name: "Spring Boot",
      icon: <SiSpringboot />,
      color: "from-green-500 to-green-600",
    },
    { name: "Docker", icon: <FaDocker />, color: "from-blue-500 to-cyan-500" },
    { name: "AWS", icon: <FaAws />, color: "from-orange-400 to-yellow-400" },
    {
      name: "PostgreSQL",
      icon: <SiPostgresql />,
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "MongoDB",
      icon: <SiMongodb />,
      color: "from-green-500 to-green-600",
    },
    { name: "Redis", icon: <SiRedis />, color: "from-red-500 to-red-600" },
    {
      name: "GraphQL",
      icon: <SiGraphql />,
      color: "from-pink-500 to-purple-500",
    },
    {
      name: "Next.js",
      icon: <SiNextdotjs />,
      color: "from-gray-700 to-gray-900",
    },
    {
      name: "Express",
      icon: <SiExpress />,
      color: "from-gray-600 to-gray-700",
    },
    { name: "Git", icon: <FaGitAlt />, color: "from-orange-500 to-red-500" },
  ];

  return (
    <section
      id="techstack"
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Tech Stack
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, index) => (
            <div
              key={tech.name}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-card/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tech.icon}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">
                  {tech.name}
                </h3>
                <div
                  className={`h-1 w-full bg-gradient-to-r ${tech.color} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>

              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
              ></div>
            </div>
          ))}
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
