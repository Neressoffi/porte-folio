"use client";

import { motion } from "framer-motion";

import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={cn("max-w-3xl", className)}
    >
      <p className="eyebrow-label mb-4">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
