"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-3 transition-all duration-500",
          scrolled
            ? "nav-scrolled glass shadow-glow"
            : "border border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="group flex items-center gap-3">
          <motion.span
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-white shadow-glow"
          >
            A
          </motion.span>
          <span className="hidden text-sm font-semibold text-foreground sm:block">
            Ariel Ngoualem
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button href="#contact" variant="glass" className="hidden px-4 py-2 sm:inline-flex">
            Me contacter
          </Button>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:border-primary/40 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-3 max-w-6xl overflow-hidden rounded-3xl p-4 lg:hidden"
          >
            <div className="grid gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </motion.a>
              ))}
              <Button
                href="#contact"
                className="mt-2 w-full justify-center"
                onClick={() => setOpen(false)}
              >
                Me contacter
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
