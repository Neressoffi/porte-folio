"use client";

import { type FormEvent, useState } from "react";
import { Loader2, Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";

import { MotionSection } from "@/components/motion-section";
import { Ps5Tilt } from "@/components/ps5-tilt";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { contact, profile } from "@/lib/data";

type FormStatus = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
    };

    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
        thankYou?: string;
        confirmation?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur lors de l'envoi.");
      }

      setStatus("success");
      setFeedback(
        [data.thankYou, data.confirmation].filter(Boolean).join(" ") ||
          "Message envoyé avec succès.",
      );
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer le message. Réessayez ou contactez-moi par email.",
      );
    }
  }

  const isLoading = status === "loading";

  return (
    <MotionSection id="contact">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Alternance full stack — disponible dès que possible"
            description={`${profile.name}, ${profile.role}. Mobilité : ${contact.location}. Échangeons sur une opportunité d'alternance ou un projet web.`}
          />

          <div className="mt-9 grid gap-4">
            <a
              href={`mailto:${contact.email}`}
              className="glass flex items-center gap-4 rounded-3xl p-5 transition hover:border-primary/40"
            >
              <Mail className="size-5 text-primary" />
              <span className="text-muted">{contact.email}</span>
            </a>
            <a
              href={contact.phoneHref}
              className="glass flex items-center gap-4 rounded-3xl p-5 transition hover:border-cyan/40"
            >
              <Phone className="size-5 text-cyan" />
              <span className="text-muted">{contact.phone}</span>
            </a>
            <div className="glass flex items-center gap-4 rounded-3xl p-5">
              <MapPin className="size-5 text-violet" />
              <span className="text-muted">{contact.location}</span>
            </div>
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-violet" />
                <span className="font-semibold">{profile.headline}</span>
              </div>
              <p className="mt-3 leading-7 text-muted">
                Profil motivé pour renforcer une équipe développement web ou
                full stack en alternance.
              </p>
            </div>
          </div>
        </div>

        <Ps5Tilt intensity={12}>
          <form
            onSubmit={handleSubmit}
            className="gaming-frame glass rounded-[2rem] p-5 md:p-8"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Nom</span>
                <input
                  name="name"
                  required
                  disabled={isLoading}
                  placeholder=""
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60 disabled:opacity-60"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Adresse e-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder=""
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60 disabled:opacity-60"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  disabled={isLoading}
                  placeholder=""
                  className="resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60 disabled:opacity-60"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer le message
                  <Send className="size-4" />
                </>
              )}
            </button>
            {feedback ? (
              <p
                className={
                  status === "success"
                    ? "mt-4 text-sm text-emerald-400"
                    : "mt-4 text-sm text-red-400"
                }
                role="status"
              >
                {feedback}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                variant="glass"
              >
                LinkedIn
              </Button>
              <Button
                href={contact.github}
                target="_blank"
                rel="noreferrer"
                variant="glass"
              >
                GitHub
              </Button>
              <Button href={contact.cvPath} variant="glass">
                CV PDF
              </Button>
            </div>
          </form>
        </Ps5Tilt>
      </div>
    </MotionSection>
  );
}
