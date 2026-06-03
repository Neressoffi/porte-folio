"use client";

import { useEffect, useRef, useState } from "react";

const DOOR_OPEN_DELAY = 620;
const DOOR_RESET_DELAY = 1180;

type DoorState = {
  label: string;
};

function getCleanLabel(element: HTMLElement) {
  return (
    element.dataset.doorLabel ||
    element.textContent?.replace(/\s+/g, " ").trim().slice(0, 42) ||
    "Ouverture"
  );
}

function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.pushState(null, "", hash);
}

export function DoorTransition() {
  const [door, setDoor] = useState<DoorState | null>(null);
  const resetTimeout = useRef<number | null>(null);
  const actionTimeout = useRef<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (resetTimeout.current) window.clearTimeout(resetTimeout.current);
      if (actionTimeout.current) window.clearTimeout(actionTimeout.current);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest<HTMLElement>(
        "[data-door-transition], a[href^='#']",
      );
      if (!trigger || trigger.dataset.doorDisabled === "true") return;

      const anchor = trigger instanceof HTMLAnchorElement ? trigger : null;
      const href = anchor?.getAttribute("href");
      const anchorUrl = anchor?.href;
      const isExternalTarget = anchor?.target && anchor.target !== "_self";

      if (isExternalTarget) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (href) {
        event.preventDefault();
      }

      if (prefersReducedMotion) {
        if (href?.startsWith("#")) scrollToHash(href);
        else if (href && anchorUrl) window.location.assign(anchorUrl);
        return;
      }

      clearTimers();
      setDoor({ label: getCleanLabel(trigger) });

      actionTimeout.current = window.setTimeout(() => {
        if (href?.startsWith("#")) scrollToHash(href);
        else if (href && anchorUrl) window.location.assign(anchorUrl);
      }, DOOR_OPEN_DELAY);

      resetTimeout.current = window.setTimeout(() => {
        setDoor(null);
      }, DOOR_RESET_DELAY);
    };

    document.addEventListener("click", handleClick);

    return () => {
      clearTimers();
      document.removeEventListener("click", handleClick);
    };
  }, []);

  if (!door) return null;

  return (
    <div className="door-stage" aria-hidden="true">
      <div className="door-vignette" />
      <div className="door-light" />
      <div className="door-panel door-panel-left">
        <span className="door-grid" />
      </div>
      <div className="door-panel door-panel-right">
        <span className="door-grid" />
      </div>
      <div className="door-core">
        <span className="door-lock">ACCESS</span>
        <span className="door-label">{door.label}</span>
      </div>
    </div>
  );
}
