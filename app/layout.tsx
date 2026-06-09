import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import { contact, profile } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteDescription = `${profile.name}, ${profile.role} en alternance (dès que possible). WordPress, Laravel, React — expériences Illisite et Amazon. ${contact.location}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://folio2026.local"),
  title: {
    default: `${profile.name} - ${profile.role} | Alternance`,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  keywords: [
    "développeur full stack",
    "alternance",
    "React",
    "Laravel",
    "WordPress",
    "ACF",
    "Paris",
    "Ariel Ngoualem",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} - ${profile.role}`,
    description: siteDescription,
    type: "website",
    locale: "fr_FR",
    images: [{ url: profile.image, width: 1024, height: 1024, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full">
        {children}
      </body>
    </html>
  );
}
