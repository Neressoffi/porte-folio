"use client";

import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";

import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const VISIBLE_STEPS = 4;

function demoHostname(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const site = demoHostname(project.demo);
  const extraSteps = Math.max(0, project.steps.length - VISIBLE_STEPS);
  const visibleSteps = project.steps.slice(0, VISIBLE_STEPS);
  const reverse = index % 2 === 1;
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "project-card gaming-frame glass grid gap-5 rounded-[2rem] p-5 md:grid-cols-2 md:gap-8 md:p-6 lg:p-7",
        reverse && "project-card--reverse",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative min-w-0">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lg">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="size-2.5 rounded-full bg-gold" />
              <span className="size-2.5 rounded-full bg-cyan" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white/5 px-2.5 py-1.5 text-xs text-slate-400">
              <Globe className="size-3.5 shrink-0 text-cyan" aria-hidden />
              <span className="truncate">{site ?? `${project.title.toLowerCase()}.illisite.info`}</span>
            </div>
          </div>
          <div
            className={cn(
              "relative aspect-video w-full overflow-hidden bg-gradient-to-br",
              project.gradient,
            )}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={`Aperçu du site ${project.title}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 960px) 100vw, 46vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-semibold text-foreground">
                {project.title}
              </div>
            )}
          </div>
        </div>
        <span
          className={cn(
            "pointer-events-none absolute -top-2 font-display text-5xl font-bold text-gold/10 select-none md:text-6xl",
            reverse ? "left-2" : "right-2",
          )}
          aria-hidden
        >
          {indexLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-col md:border-l md:border-white/10 md:pl-6 lg:pl-8">
        <div className="mb-3">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              {project.category}
            </span>
            <span className="text-xs text-slate-500">{project.client}</span>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {project.title}
          </h3>
        </div>

        <p className="text-base leading-8 text-muted">{project.description}</p>

        {visibleSteps.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {visibleSteps.map((step) => (
              <li
                key={step}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-slate-300"
              >
                {step}
              </li>
            ))}
            {extraSteps > 0 ? (
              <li className="flex items-center px-3 text-xs font-semibold text-gold">
                + {extraSteps} autres points
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <ul className="flex flex-wrap gap-2" aria-label="Technologies">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
              >
                {tech}
              </li>
            ))}
          </ul>

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-primary/90"
            >
              Visiter le site
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          ) : (
            <p className="text-sm text-muted">En recette</p>
          )}
        </div>
      </div>
    </article>
  );
}
