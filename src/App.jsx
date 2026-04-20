import Navigation from "./components/Navigation.jsx";
import Landing from "./components/Landing.jsx";
import TechStack from "./components/TechStack.jsx";
import MediumArticles from "./components/MediumArticles.jsx";
import Patents from "./components/Patents.jsx";
import Projects from "./components/Projects.jsx";
import OpenSource from "./components/OpenSource.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <Landing />
        <TechStack />
        <Projects />
        <OpenSource />
        <Patents />
        <MediumArticles />
      </main>
      <Footer />
    </div>
  );
}

export default App;

