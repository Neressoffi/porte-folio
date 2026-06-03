"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type Ps5TiltProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  intensity?: number;
  float?: boolean;
};

export function Ps5Tilt({
  children,
  className,
  innerClassName,
  intensity = 16,
  float = false,
}: Ps5TiltProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = mq.matches;
    const handler = () => {
      reducedRef.current = mq.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const rotateX = useSpring(0, { stiffness: 140, damping: 16, mass: 0.35 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 16, mass: 0.35 });
  const scale = useSpring(1, { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(103, 232, 249, 0.28), rgba(79, 140, 255, 0.12) 38%, transparent 62%)`;

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedRef.current) return;
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(x * intensity);
    rotateX.set(-y * intensity);
    scale.set(1.04);
    glowX.set((x + 0.5) * 100);
    glowY.set((y + 0.5) * 100);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glowX.set(50);
    glowY.set(50);
  }

  return (
    <div className={cn("ps5-perspective", className)}>
      <motion.div
        animate={float ? { y: [0, -14, 0] } : undefined}
        transition={
          float
            ? { duration: 4.8, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <motion.div
          ref={wrapRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
          className={cn("ps5-tilt-shell relative", innerClassName)}
        >
        <motion.div
          className="ps5-tilt-glow pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBackground }}
          aria-hidden
        />
        <div className="ps5-tilt-content relative">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
