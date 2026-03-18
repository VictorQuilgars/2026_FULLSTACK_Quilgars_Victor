"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/particuliers", label: "Particuliers" },
  { href: "/professionnels", label: "Professionnels" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rose-primary/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/round.png"
            alt="Roz Nettoyage"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Roz Nettoyage
            </p>
            <p className="text-[11px] text-slate-500">
              Nettoyage textile &amp; automobile
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-rose-primary ${
                pathname === link.href ? "text-rose-primary font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/espace-client"
            className="rounded-full border border-rose-primary/30 px-4 py-1.5 text-xs font-semibold text-rose-primary hover:bg-rose-gradient hover:text-white transition"
          >
            Espace client
          </Link>
        </nav>

        {/* Phone numbers - desktop */}
        <div className="hidden items-center gap-3 text-xs text-slate-500 lg:flex">
          <a
            href="tel:+33772103552"
            className="hover:text-rose-primary transition"
          >
            07 72 10 35 52
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="tel:+33602243720"
            className="hover:text-rose-primary transition"
          >
            06 02 24 37 20
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-rose-primary/10 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-rose-soft/60 ${
                  pathname === link.href
                    ? "bg-rose-soft/60 text-rose-primary font-semibold"
                    : "text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/espace-client"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-full bg-rose-gradient px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Espace client
            </Link>
          </nav>
          <div className="mt-3 flex gap-3 text-xs text-slate-500">
            <a href="tel:+33772103552" className="hover:text-rose-primary">
              07 72 10 35 52
            </a>
            <a href="tel:+33602243720" className="hover:text-rose-primary">
              06 02 24 37 20
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
