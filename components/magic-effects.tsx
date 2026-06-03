"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  hue: number;
};

type SparkStyle = CSSProperties &
  Record<"--spark-dx" | "--spark-dy" | "--spark-hue", string>;

export function MagicEffects() {
  const auraRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const latestPoint = useRef({ x: 0, y: 0 });
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const moveAura = () => {
      const aura = auraRef.current;
      if (aura) {
        aura.style.transform = `translate3d(${latestPoint.current.x}px, ${latestPoint.current.y}px, 0) translate(-50%, -50%)`;
      }
      frameRef.current = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestPoint.current = { x: event.clientX, y: event.clientY };
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(moveAura);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const createdAt = Date.now();
      const nextSparks = Array.from({ length: 12 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12 + Math.random() * 0.34;
        const distance = 52 + Math.random() * 82;

        return {
          id: createdAt + index,
          x: event.clientX,
          y: event.clientY,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 4 + Math.random() * 7,
          hue: 190 + Math.random() * 75,
        };
      });

      setSparks((current) => [...current, ...nextSparks].slice(-36));
      window.setTimeout(() => {
        setSparks((current) =>
          current.filter((spark) => !nextSparks.some((item) => item.id === spark.id)),
        );
      }, 900);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="magic-layer" aria-hidden="true">
      <div className="magic-aurora magic-aurora-one" />
      <div className="magic-aurora magic-aurora-two" />
      <div ref={auraRef} className="magic-cursor-aura" />
      {sparks.map((spark) => {
        const style: SparkStyle = {
          left: spark.x,
          top: spark.y,
          width: spark.size,
          height: spark.size,
          "--spark-dx": `${spark.dx}px`,
          "--spark-dy": `${spark.dy}px`,
          "--spark-hue": `${spark.hue}`,
        };

        return <span key={spark.id} className="magic-spark" style={style} />;
      })}
    </div>
  );
}
