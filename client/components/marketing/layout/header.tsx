"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/particuliers", label: "Particuliers" },
  { href: "/professionnels", label: "Professionnels" },
];

export function SiteHeader() {
  const pathname = usePathname();

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
            className="rounded-full border border-rose-primary px-4 py-1.5 text-xs font-semibold text-rose-primary hover:bg-rose-primary hover:text-white transition"
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

        {/* Mobile profile icon */}
        <Link
          href="/espace-client"
          className={`grid h-9 w-9 place-items-center rounded-full transition md:hidden ${
            pathname.startsWith("/espace-client")
              ? "bg-rose-soft/70 text-rose-primary"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-label="Mon espace client"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </Link>

      </div>
    </header>
  );
}
