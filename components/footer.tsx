import { contact, navItems, profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4">
      <div className="glass flex flex-col gap-6 rounded-[2rem] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.role} — {profile.headline}
          </p>
          <p className="mt-2 text-xs text-muted">
            {contact.email} · {contact.phone}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
