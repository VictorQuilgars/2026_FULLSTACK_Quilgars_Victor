export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Roz Nettoyage. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-4">
          <a href="tel:+33772103552" className="hover:text-slate-700">
            07 72 10 35 52
          </a>
          <a href="tel:+33602243720" className="hover:text-slate-700">
            06 02 24 37 20
          </a>
          <span>Brest et alentours</span>
        </div>
      </div>
    </footer>
  );
}

