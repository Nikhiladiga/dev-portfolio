import { Button } from "./ui/button.jsx";
import { Download } from "lucide-react";
import nikhil from "../assets/nikhil.png";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createParticles(count, spread) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color1 = new THREE.Color("#ffffff");
  const color2 = new THREE.Color("#146FE1"); // Brand blue
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(spread);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(spread);
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(spread);
    
    // Mix colors to get a nice range between white and brand blue
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }
  return [positions, colors];
}

const ParticleField = () => {
  const pointsRef1 = useRef();
  const pointsRef2 = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  // Create a circular texture for glowing particles
  const circleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const [positions1, colors1] = useMemo(() => createParticles(2000, 30), []);
  const [positions2, colors2] = useMemo(() => createParticles(1500, 50), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pointsRef1.current && pointsRef2.current) {
      // Continuous slow rotation
      pointsRef1.current.rotation.y = time * 0.03;
      pointsRef1.current.rotation.x = time * 0.02;
      pointsRef2.current.rotation.y = time * 0.02;
      pointsRef2.current.rotation.z = time * 0.01;

      // Parallax effect based on mouse hover
      const targetX = mouse.current.x * 2;
      const targetY = mouse.current.y * 2;
      
      pointsRef1.current.position.x += (targetX - pointsRef1.current.position.x) * 0.02;
      pointsRef1.current.position.y += (targetY - pointsRef1.current.position.y) * 0.02;
      
      pointsRef2.current.position.x += (targetX * 0.5 - pointsRef2.current.position.x) * 0.02;
      pointsRef2.current.position.y += (targetY * 0.5 - pointsRef2.current.position.y) * 0.02;
    }
  });

  return (
    <>
      <points ref={pointsRef1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions1.length / 3} array={positions1} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors1.length / 3} array={colors1} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.18} 
          map={circleTexture} 
          vertexColors 
          transparent 
          opacity={0.9} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </points>
      <points ref={pointsRef2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions2.length / 3} array={positions2} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors2.length / 3} array={colors2} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          map={circleTexture} 
          vertexColors 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </points>
    </>
  );
};

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
      {/* 3D Particle Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <fog attach="fog" args={["#000000", 10, 50]} />
          <ParticleField />
        </Canvas>
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border border-white/20 p-1 bg-background/50 backdrop-blur-sm">
                <img
                  src={nikhil}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Name and Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">
            Nikhil Adiga
          </h1>
          <h2 className="text-2xl md:text-4xl text-gray-300 mb-8 font-light tracking-wide drop-shadow-md">
            Software Engineer
          </h2>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Crafting the future through code. Passionate about building
            innovative solutions that bridge the gap between imagination and
            reality.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleDownloadResume}
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 mb-16 rounded-none border border-white/20 text-gray-300 hover:bg-[#146FE1] hover:border-[#146FE1] hover:text-white transition-all duration-300 bg-background/50 backdrop-blur-sm"
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
