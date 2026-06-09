"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  GraduationCap,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import {
  careerSummary,
  experienceTypeLabels,
  experiences,
  type Experience,
  type ExperienceType,
} from "@/lib/data";
import { MotionSection } from "@/components/motion-section";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "pro" | "formation";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "pro", label: "Professionnel" },
  { key: "formation", label: "Formation" },
];

const typeGradients: Record<ExperienceType, string> = {
  alternance: "from-red-900/40 via-red-950/30 to-transparent",
  stage: "from-amber-900/35 via-stone-900/40 to-transparent",
  formation: "from-cyan-900/35 via-slate-900/40 to-transparent",
};

const typeIcons: Record<ExperienceType, typeof Briefcase> = {
  alternance: Briefcase,
  stage: Building2,
  formation: GraduationCap,
};

const badgeStyles: Record<ExperienceType, string> = {
  alternance: "border-primary/30 bg-primary/10 text-red-200",
  stage: "border-gold/30 bg-gold/10 text-amber-100",
  formation: "border-cyan/30 bg-cyan/10 text-cyan-100",
};

const VISIBLE_POINTS = 4;

function matchesFilter(item: Experience, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "formation") return item.type === "formation";
  return item.type === "alternance" || item.type === "stage";
}

function ExperienceCard({ item, index }: { item: Experience; index: number }) {
  const typeInfo = experienceTypeLabels[item.type];
  const reverse = index % 2 === 1;
  const indexLabel = String(index + 1).padStart(2, "0");
  const Icon = typeIcons[item.type];
  const extraPoints = Math.max(0, (item.points?.length ?? 0) - VISIBLE_POINTS);
  const visiblePoints = item.points?.slice(0, VISIBLE_POINTS) ?? [];

  return (
    <article
      className={cn(
        "experience-card gaming-frame glass grid gap-5 rounded-[2rem] p-5 md:grid-cols-2 md:gap-8 md:p-6 lg:p-7",
        reverse && "experience-card--reverse",
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
            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-gold">
              {item.period}
              {item.duration ? (
                <span className="font-medium text-slate-500"> · {item.duration}</span>
              ) : null}
            </p>
          </div>
          <div
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-gradient-to-br p-6 text-center",
              typeGradients[item.type],
            )}
          >
            <Icon className="size-10 text-cyan" aria-hidden />
            <p className="font-display text-xl font-bold text-foreground md:text-2xl">
              {item.company}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-300">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {item.location}
            </p>
            <span
              className={cn(
                "mt-1 rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider",
                badgeStyles[item.type],
              )}
            >
              {typeInfo.label}
            </span>
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
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
                badgeStyles[item.type],
              )}
            >
              {typeInfo.label}
            </span>
            <span className="text-xs font-semibold text-gold">
              {item.period}
              {item.duration ? ` · ${item.duration}` : ""}
            </span>
          </div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{item.company}</p>
        </div>

        <p className="text-base leading-8 text-muted">{item.description}</p>

        {visiblePoints.length > 0 ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {visiblePoints.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-relaxed text-slate-300"
              >
                {point}
              </li>
            ))}
            {extraPoints > 0 ? (
              <li className="flex items-center px-3 text-xs font-semibold text-gold">
                + {extraPoints} autres points
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          {item.stack?.length ? (
            <ul className="flex flex-wrap gap-2" aria-label="Technologies">
              {item.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}

          <a
            href="#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-primary/90"
          >
            Me contacter
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Experience() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(
    () => experiences.filter((item) => matchesFilter(item, filter)),
    [filter],
  );

  return (
    <MotionSection id="experience" aria-labelledby="experience-title">
      <SectionHeading
        eyebrow="Parcours"
        title="Expériences & formation."
        description="Chronologie de mes missions et de ma formation — de la plus récente à la plus ancienne."
      />

      <p className="mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base leading-8 text-slate-200">
        {careerSummary.headline}
      </p>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filtrer le parcours"
      >
        {filters.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={filter === tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              filter === tab.key
                ? "border-primary/50 bg-primary/15 text-foreground"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="experience-showcase mt-10 md:mt-12">
        {filtered.map((item, index) => (
          <ExperienceCard
            key={`${item.company}-${item.period}`}
            item={item}
            index={index}
          />
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        <a
          href="#contact"
          className="font-semibold text-gold transition hover:text-foreground"
        >
          Me contacter
        </a>{" "}
        pour une alternance ou un poste développeur web / full stack.
      </p>
    </MotionSection>
  );
}
