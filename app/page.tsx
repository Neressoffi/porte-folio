import { BuddySceneProvider } from "@/components/buddy-scene-provider";
import { AnalyticsTracker } from "@/components/analytics-tracker";
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
import { ProfileBuddy } from "@/components/profile-buddy";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <BuddySceneProvider>
      <main className="content-stack relative isolate overflow-hidden">
        <AnalyticsTracker />
        <SceneBackground />
        <MagicEffects />
        <DoorTransition />
        <ScrollProgress />
        <div className="content-stack-layer">
          <Navbar />
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Experience />
          <Contact />
          <Footer />
        </div>
        <ProfileBuddy />
      </main>
    </BuddySceneProvider>
  );
}
