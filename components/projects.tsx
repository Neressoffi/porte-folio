import { ArrowUpRight, GitBranch } from "lucide-react";

import { MotionSection } from "@/components/motion-section";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import {
  contact,
  personalProjects,
  projects,
  schoolProjects,
  type SideProject,
} from "@/lib/data";

function SideProjectGrid({
  items,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  items: SideProject[];
  columns?: string;
}) {
  return (
    <div className={`mt-8 grid gap-4 ${columns}`}>
      {items.map((project) => (
        <article
          key={project.title}
          className="gaming-frame glass flex flex-col rounded-2xl border border-white/10 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {project.category}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
            {project.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
              >
                {tech}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan transition hover:text-white"
              >
                Voir le projet
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-400 transition hover:text-white"
              >
                <GitBranch className="size-4" />
                GitHub
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Projects() {
  const withLink = projects.filter((p) => p.demo).length;

  return (
    <>
      <MotionSection id="projects" aria-labelledby="projects-title">
        <SectionHeading
          eyebrow="Projets professionnels"
          title="Sites en ligne — réalisations Illisite."
          description={`${withLink} sites livrés chez Illisite — chaque vignette ouvre le projet en ligne.`}
        />

        <div className="project-showcase mt-10 md:mt-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </MotionSection>

      <MotionSection aria-labelledby="personal-projects-title" className="mt-4">
        <SectionHeading
          eyebrow="Projets personnels"
          title="Portfolio & outils perso."
          description="Projets développés en autonomie, déployés en ligne."
        />
        <SideProjectGrid items={personalProjects} columns="sm:grid-cols-2" />
      </MotionSection>

      <MotionSection aria-labelledby="school-projects-title" className="mt-4">
        <SectionHeading
          eyebrow="Projets école"
          title="Travaux Cloud Campus."
          description={`Tous les projets sont disponibles sur ${contact.github.replace("https://", "")}.`}
        />
        <SideProjectGrid items={schoolProjects} />
      </MotionSection>
    </>
  );
}
