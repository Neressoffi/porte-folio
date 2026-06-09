export type AnalyticsZoneId =
  | "top"
  | "about"
  | "stack"
  | "projects"
  | "experience"
  | "contact"
  | "footer"
  | "navbar";

export const ANALYTICS_ZONES: Record<
  AnalyticsZoneId,
  { id: AnalyticsZoneId; label: string; selector: string }
> = {
  top: { id: "top", label: "Accueil", selector: "#top" },
  about: { id: "about", label: "À propos", selector: "#about" },
  stack: { id: "stack", label: "Technologies", selector: "#stack" },
  projects: { id: "projects", label: "Projets", selector: "#projects" },
  experience: { id: "experience", label: "Parcours", selector: "#experience" },
  contact: { id: "contact", label: "Contact", selector: "#contact" },
  footer: { id: "footer", label: "Pied de page", selector: "#footer" },
  navbar: { id: "navbar", label: "Navigation", selector: ".site-nav" },
};

export const ANALYTICS_ZONE_IDS = Object.keys(ANALYTICS_ZONES) as AnalyticsZoneId[];

export function isAnalyticsZoneId(value: string): value is AnalyticsZoneId {
  return value in ANALYTICS_ZONES;
}

export function resolveZoneFromElement(element: Element | null): AnalyticsZoneId | null {
  if (!element) return null;

  const nav = element.closest(".site-nav");
  if (nav) return "navbar";

  const section = element.closest<HTMLElement>("section[id], footer[id]");
  const sectionId = section?.id;

  if (sectionId && isAnalyticsZoneId(sectionId)) {
    return sectionId;
  }

  return null;
}
