"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Cpu,
  Download,
  FolderKanban,
  MapPin,
  Rocket,
  Sparkles,
} from "lucide-react";

import { ProfilePhoto } from "@/components/profile-photo";
import { Ps5Tilt } from "@/components/ps5-tilt";
import { Button } from "@/components/ui/button";
import { contact, profile, stats } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/motion";

const stackLine = ["WordPress", "Laravel", "React", "Tailwind / SCSS"];

const statIcons = [FolderKanban, Briefcase, Rocket] as const;

export function Hero() {
  const { scrollY } = useScroll();
  const y = useSpring(useTransform(scrollY, [0, 500], [0, 90]), {
    stiffness: 80,
    damping: 22,
  });
  const opacity = useTransform(scrollY, [0, 480], [1, 0.45]);

  return (
    <section
      id="top"
      className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 pb-20 pt-28 md:grid-cols-[1.08fr_0.92fr] md:pt-36"
    >
      <motion.div
        style={{ y, opacity }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div variants={fadeUp} className="badge-pulse mb-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          </span>
          {profile.headline}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-balance md:text-7xl"
        >
          <span className="text-gradient">{profile.role}</span>
          <span className="mt-2 block text-foreground">
            powered by code, design & impact.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
          {profile.tagline}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
          <Button href="#projects">
            <Rocket className="size-4" />
            Accéder aux missions
            <ArrowRight className="size-4" />
          </Button>
          <Button
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            variant="glass"
          >
            <Briefcase className="size-4" />
            LinkedIn
          </Button>
          <Button href={contact.cvPath} variant="glass">
            <Download className="size-4" />
            CV PDF
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center gap-3 text-sm text-muted"
        >
          <MapPin className="size-4 text-gold" />
          <span>{contact.location}</span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="flex flex-wrap gap-2">
            {stackLine.map((item) => (
              <span
                key={item}
                className="rounded-full border border-gold/20 bg-primary/10 px-3 py-1 text-xs text-amber-100/90"
              >
                {item}
              </span>
            ))}
          </span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="gaming-hud mt-8 grid max-w-2xl gap-3 sm:grid-cols-3"
        >
          {stats.map((stat, index) => {
            const Icon = statIcons[index] ?? Rocket;

            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{ y: -8, rotateX: 8, rotateY: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="relative overflow-hidden rounded-2xl border border-primary/30 bg-white/[0.04] p-4"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="flex items-center justify-between gap-3">
                  <Icon className="size-4 text-gold" />
                  <span className="font-display text-xl font-semibold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-1 text-[11px] text-cyan/90">{stat.detail}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <Ps5Tilt className="relative mx-auto w-full max-w-sm md:max-w-md" intensity={22} float>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 14 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-full bg-primary/30 blur-3xl" />
          <div className="arc-float absolute -right-6 top-8 z-20 hidden rounded-full border border-cyan/40 bg-cyan/10 p-4 text-cyan shadow-[0_0_42px_rgba(56,189,248,0.45)] md:block">
            <Cpu className="size-7" />
          </div>

          <div className="gaming-frame glass relative overflow-hidden rounded-[2rem] p-6">
            <div className="gaming-scanlines absolute inset-0" />
            <span className="hud-corner left-4 top-4" />
            <span className="hud-corner right-4 top-4 rotate-90" />
            <span className="hud-corner bottom-4 right-4 rotate-180" />
            <span className="hud-corner bottom-4 left-4 -rotate-90" />

            <div className="profile-photo-frame relative aspect-square overflow-hidden rounded-[1.5rem] border border-gold/25 bg-[#0a0708]">
              <div
                className="profile-orbit-ring pointer-events-none absolute inset-0 z-[1] rounded-[1.5rem]"
                aria-hidden
              />

              <ProfilePhoto
                variant="fill"
                className="absolute inset-[5px] z-[2] rounded-[1.2rem]"
                imageClassName="object-[center_22%]"
                priority
                sizes="(max-width: 768px) 360px, 480px"
              />

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[42%] bg-gradient-to-t from-[#0a0708]/95 via-[#0a0708]/40 to-transparent"
                aria-hidden
              />
              <Sparkles className="absolute right-4 top-4 z-[4] size-7 text-gold/80" />

              <div className="absolute left-4 top-4 z-[4] rounded-full border border-gold/25 bg-black/50 px-3 py-1 text-xs text-amber-100/90 backdrop-blur-sm">
                • {profile.role}
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-[4] rounded-2xl border border-cyan/25 bg-black/50 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-cyan">
                  <span>Systems Online</span>
                  <span className="neon-pulse size-2 rounded-full bg-cyan" />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-gold to-cyan"
                    initial={{ width: "0%" }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Illisite • Amazon • CCESI • DEKRA
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </Ps5Tilt>
    </section>
  );
}
