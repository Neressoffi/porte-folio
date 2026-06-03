"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionSectionProps = HTMLMotionProps<"section">;

export function MotionSection({
  children,
  className,
  ...props
}: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className={cn("mx-auto w-full max-w-6xl px-6 py-24 md:py-32", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
