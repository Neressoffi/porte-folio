"use client";

import { motion } from "framer-motion";

import { MotionSection } from "@/components/motion-section";
import { Ps5Tilt } from "@/components/ps5-tilt";
import { SectionHeading } from "@/components/section-heading";
import { techStack } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function TechStack() {
  return (
    <MotionSection id="stack">
      <SectionHeading
        eyebrow="Technologies"
        title="Les outils que j'utilise au quotidien."
        description="Technologies alignées sur mon CV : React côté interface, Laravel et WordPress côté serveur, MySQL et méthode Agile."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {techStack.map((tech) => {
          const Icon = tech.icon;

          return (
            <motion.div key={tech.name} variants={fadeUp}>
            <Ps5Tilt intensity={14}>
            <article
              data-door-transition="true"
              data-door-label={`${tech.name}`}
              className="magic-card gaming-hud group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition-colors hover:border-primary/40"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tech.tone} opacity-0 transition duration-500 group-hover:opacity-100`}
              />
              <div className="relative flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-primary"
                >
                  <Icon className="size-5" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">{tech.name}</h3>
                  <p className="mt-1 text-sm text-muted">En production</p>
                </div>
              </div>
            </article>
            </Ps5Tilt>
            </motion.div>
          );
        })}
      </motion.div>
    </MotionSection>
  );
}
