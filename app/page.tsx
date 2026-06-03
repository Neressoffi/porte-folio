import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DoorTransition } from "@/components/door-transition";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MagicEffects } from "@/components/magic-effects";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { ScrollProgress } from "@/components/scroll-progress";
import { SceneBackground } from "@/components/scene-background";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="content-stack relative isolate overflow-hidden">
      <SceneBackground />
      <MagicEffects />
      <DoorTransition />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
