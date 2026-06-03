"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "magic-interactive relative z-[1] inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary px-6 py-3 text-white shadow-glow hover:bg-primary/90",
        glass:
          "glass px-6 py-3 text-foreground hover:border-primary/60 hover:bg-white/10",
        ghost: "px-4 py-2 text-muted hover:bg-white/5 hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonProps = HTMLMotionProps<"a"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <motion.a
      data-door-transition="true"
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}
