"use client";

import Image from "next/image";

import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";

type ProfilePhotoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Remplit un cadre carré/rectangulaire (hero) ou rond (à propos) */
  variant?: "circle" | "fill";
  /** Avatar serré pour le cercle (section À propos) */
  avatar?: boolean;
};

export function ProfilePhoto({
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 320px, 400px",
  variant = "circle",
  avatar = false,
}: ProfilePhotoProps) {
  const isFill = variant === "fill";
  const src = avatar ? "/profile-avatar.png" : profile.image;

  return (
    <div
      className={cn(
        "relative aspect-square shrink-0 overflow-hidden",
        isFill
          ? "size-full rounded-[inherit]"
          : "rounded-full border-2 border-gold/40 bg-[#0a0708] shadow-glow",
        className,
      )}
    >
      <Image
        src={src}
        alt={`Photo professionnelle de ${profile.name}`}
        fill
        priority={priority}
        quality={100}
        unoptimized
        className={cn(
          "object-cover",
          isFill ? "object-[center_22%]" : "object-center scale-[1.02]",
          avatar && "object-[center_38%] scale-[1.08]",
          imageClassName,
        )}
        sizes={sizes}
      />
    </div>
  );
}
