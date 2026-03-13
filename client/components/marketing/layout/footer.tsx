import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-gradient text-sm font-bold text-white">
                RZ
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">
                  Roz Nettoyage
                </p>
                <p className="text-[11px] text-slate-400">Brest et alentours</p>
              </div>
            </div>
            <p className="max-w-xs text-xs text-slate-400 leading-relaxed">
              Nettoyage textile et automobile professionnel pour particuliers et
              entreprises.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Navigation
            </p>
            <nav className="flex flex-col gap-1.5 text-sm">
              <Link href="/" className="hover:text-white transition">
                Accueil
              </Link>
              <Link
                href="/particuliers"
                className="hover:text-white transition"
              >
                Particuliers
              </Link>
              <Link
                href="/professionnels"
                className="hover:text-white transition"
              >
                Professionnels
              </Link>
              <Link
                href="/espace-client"
                className="hover:text-white transition"
              >
                Espace client
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </p>
            <div className="space-y-1.5 text-sm">
              <a
                href="tel:+33772103552"
                className="block hover:text-white transition"
              >
                07 72 10 35 52
              </a>
              <a
                href="tel:+33602243720"
                className="block hover:text-white transition"
              >
                06 02 24 37 20
              </a>
              <a
                href="mailto:roz.nettoyage@gmail.com"
                className="block hover:text-white transition"
              >
                roz.nettoyage@gmail.com
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Réseaux
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61570851498498"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:bg-rose-primary hover:text-white transition"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/roz_nettoyage/"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-slate-300 hover:bg-rose-primary hover:text-white transition"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Roz Nettoyage. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
