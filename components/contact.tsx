"use client";

import { type FormEvent, useState } from "react";
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";

import { MotionSection } from "@/components/motion-section";
import { Ps5Tilt } from "@/components/ps5-tilt";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { contact, profile } from "@/lib/data";

export function Contact() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const message = form.get("message");

    const subject = encodeURIComponent(`Contact portfolio - ${name}`);
    const body = encodeURIComponent(String(message));
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setStatus("Ton client mail va s'ouvrir avec le message prérempli.");
  }

  return (
    <MotionSection id="contact">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Alternance full stack — disponible ASAP"
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
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Nom</span>
                <input
                  name="name"
                  required
                  placeholder=""
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder=""
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder=""
                  className="resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-primary/60"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Envoyer le message
              <Send className="size-4" />
            </button>
            {status ? <p className="mt-4 text-sm text-cyan">{status}</p> : null}

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
