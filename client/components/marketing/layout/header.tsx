import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose-primary/10 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-gradient text-sm font-bold text-white shadow-rose-md">
            RZ
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Roz Nettoyage
            </p>
            <p className="text-[11px] text-slate-500">
              Intérieur voiture & textile
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-xs font-medium text-slate-700 md:text-sm">
          <Link href="/services" className="hover:text-slate-950">
            Prestations
          </Link>
          <Link href="/contact" className="hover:text-slate-950">
            Devis
          </Link>
          <Link
            href="/espace-client"
            className="rounded-full border border-rose-primary/30 px-3 py-1.5 text-xs font-semibold text-rose-primary hover:bg-rose-gradient hover:text-white md:px-4"
          >
            Espace client
          </Link>
        </nav>
      </div>
    </header>
  );
}

