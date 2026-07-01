"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { MotionSection } from "@/components/motion-section";
import { ProfilePhoto } from "@/components/profile-photo";
import { Ps5Tilt } from "@/components/ps5-tilt";
import { SectionHeading } from "@/components/section-heading";
import { highlights, languages, profile, softSkills } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function About() {
  return (
    <MotionSection id="about" className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
      <div className="md:sticky md:top-28 md:self-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center md:justify-start"
        >
          <ProfilePhoto
            avatar
            className="size-36 md:size-40"
            sizes="160px"
          />
        </motion.div>
        <SectionHeading
          eyebrow="À propos"
          title="Développeur fullstack, rigoureux et collaboratif."
          description="Alternance Illisite et stage Amazon : WordPress, Laravel, React.js, API REST et déploiement en production."
        />
      </div>

      <Ps5Tilt intensity={12}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="gaming-frame glass rounded-[2rem] p-6 md:p-8"
      >
        <motion.p variants={fadeUp} className="text-lg leading-8 text-slate-200">
          Je suis <strong className="text-foreground">{profile.name}</strong>,{" "}
          {profile.role.toLowerCase()} — <strong className="text-cyan">{profile.headline}</strong>.
          Étudiant en Bachelor CDA chez Cloud Campus (Paris, 2025–2027), je mets en
          pratique WordPress, Laravel, PHP et React.js grâce à mon alternance chez
          Illisite et mon stage full stack chez Amazon.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <span
              key={lang.name}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {lang.name} · {lang.level}
            </span>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer} className="mt-8 grid gap-4">
          {highlights.map((item) => (
            <motion.div
              key={item}
              variants={fadeUp}
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-primary/30 hover:bg-white/[0.06]"
            >
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-cyan" />
              <span className="text-muted">{item}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={staggerContainer} className="mt-6 grid gap-2 sm:grid-cols-2">
          {softSkills.map((skill) => (
            <motion.span
              key={skill}
              variants={fadeUp}
              className="rounded-xl border border-violet/20 bg-violet/5 px-3 py-2 text-center text-xs text-violet-200"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.a
          variants={fadeUp}
          href="#experience"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-foreground"
        >
          Voir mon parcours détaillé →
        </motion.a>
      </motion.div>
      </Ps5Tilt>
    </MotionSection>
  );
}
