import { projects } from "@/lib/data";

import { MotionSection } from "@/components/motion-section";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";

export function Projects() {
  const withLink = projects.filter((p) => p.demo).length;

  return (
    <MotionSection id="projects" aria-labelledby="projects-title">
      <SectionHeading
        eyebrow="Projets"
        title="Sites en ligne — réalisations Illisite."
        description={`${withLink} sites livrés chez Illisite — chaque vignette ouvre le projet en ligne.`}
      />

      <div className="project-showcase mt-10 md:mt-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </MotionSection>
  );
}
