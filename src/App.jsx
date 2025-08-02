import Navigation from "./components/Navigation.jsx";
import Landing from "./components/Landing.jsx";
import TechStack from "./components/TechStack.jsx";
import MediumArticles from "./components/MediumArticles.jsx";
import Projects from "./components/Projects.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen futuristic-bg">
      <Navigation />
      <main>
        <Landing />
        <TechStack />
        <MediumArticles />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;
