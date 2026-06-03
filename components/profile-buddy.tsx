"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

type Mood = {
  id: string;
  emoji: string;
  message: string;
  faceClass: string;
};

const MOODS: Mood[] = [
  {
    id: "happy",
    emoji: "😄",
    message: "Salut, je suis le mini-Ariel !",
    faceClass: "buddy-face-happy",
  },
  {
    id: "run",
    emoji: "💨",
    message: "Je descends avec toi !",
    faceClass: "buddy-face-run",
  },
  {
    id: "cool",
    emoji: "😎",
    message: "Laravel + React = stylé",
    faceClass: "buddy-face-cool",
  },
  {
    id: "wow",
    emoji: "🤩",
    message: "7 sites en ligne, respect !",
    faceClass: "buddy-face-wow",
  },
  {
    id: "think",
    emoji: "🤔",
    message: "Alternance ? Je dis oui !",
    faceClass: "buddy-face-think",
  },
  {
    id: "laugh",
    emoji: "😆",
    message: "Bug trouvé… c'était un ;",
    faceClass: "buddy-face-laugh",
  },
];

const BUDDY_TOP_OFFSET = 72;
const BUDDY_BOTTOM_MARGIN = 96;

function Buddy3D({
  mood,
  rotateY,
  rotateX,
  translateZ,
}: {
  mood: Mood;
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  translateZ: MotionValue<number>;
}) {
  return (
    <motion.div
      className="profile-buddy-3d-stage"
      style={{
        rotateY,
        rotateX,
        z: translateZ,
        transformStyle: "preserve-3d",
      }}
    >
      <div className={cn("profile-buddy-body", mood.faceClass)}>
        <div className="profile-buddy-bubble">
          <span className="profile-buddy-emoji">{mood.emoji}</span>
          <p>{mood.message}</p>
        </div>

        <div className="profile-buddy-avatar-wrap">
          <Image
            src="/profile-avatar.png"
            alt=""
            width={72}
            height={72}
            className="profile-buddy-avatar"
            unoptimized
          />
          <span className="profile-buddy-cheeks" aria-hidden />
        </div>

        <div className="profile-buddy-legs" aria-hidden>
          <span className="profile-buddy-leg profile-buddy-leg-a" />
          <span className="profile-buddy-leg profile-buddy-leg-b" />
        </div>
      </div>
    </motion.div>
  );
}

export function ProfileBuddy() {
  const [mounted, setMounted] = useState(false);
  const [moodIndex, setMoodIndex] = useState(0);
  const [side, setSide] = useState<"left" | "right">("right");
  const [visible, setVisible] = useState(true);
  const [travelPx, setTravelPx] = useState(480);

  const { scrollY, scrollYProgress } = useScroll();

  const y = useSpring(
    useTransform(scrollY, (latest) => {
      const max = Math.max(0, travelPx);
      const ratio = max === 0 ? 0 : Math.min(1, latest / max);
      return ratio * max;
    }),
    { stiffness: 120, damping: 22, mass: 0.35 },
  );

  const rotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [22, 4, -20]),
    { stiffness: 100, damping: 18 },
  );

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [18, 8, -4, -16]),
    { stiffness: 100, damping: 18 },
  );

  const translateZ = useSpring(
    useTransform(scrollYProgress, [0, 1], [32, 120]),
    { stiffness: 80, damping: 18 },
  );

  const mood = MOODS[moodIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const travel = Math.max(
        120,
        maxScroll - BUDDY_TOP_OFFSET - BUDDY_BOTTOM_MARGIN,
      );
      setTravelPx(travel);
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const moodTimer = window.setInterval(() => {
      setMoodIndex((i) => (i + 1) % MOODS.length);
    }, 3200);

    const sideTimer = window.setInterval(() => {
      setSide((s) => (s === "left" ? "right" : "left"));
    }, 8000);

    return () => {
      window.clearInterval(moodTimer);
      window.clearInterval(sideTimer);
    };
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <motion.div
      className={cn(
        "profile-buddy pointer-events-none",
        side === "left" ? "profile-buddy-left" : "profile-buddy-right",
      )}
      style={{
        top: BUDDY_TOP_OFFSET,
        y,
        transformPerspective: 900,
      }}
      aria-hidden
    >
      <div
        className={cn(
          "profile-buddy-inner",
          side === "left" && "profile-buddy-inner-flip",
        )}
      >
        <Buddy3D
          mood={mood}
          rotateY={rotateY}
          rotateX={rotateX}
          translateZ={translateZ}
        />
      </div>

      <button
        type="button"
        className="profile-buddy-close pointer-events-auto"
        onClick={() => setVisible(false)}
        aria-label={`Masquer le compagnon ${profile.name}`}
      >
        ×
      </button>
    </motion.div>,
    document.body,
  );
}
