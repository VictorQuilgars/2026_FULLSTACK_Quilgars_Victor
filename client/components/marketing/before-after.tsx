export function BeforeAfter() {
  const transformations = [
    {
      title: "Intérieur voiture",
      description:
        "Sièges, tapis et plastiques traités en profondeur pour un résultat visible immédiatement.",
    },
    {
      title: "Canapé textile",
      description:
        "Taches, odeurs et acariens éliminés. Votre salon retrouve une seconde jeunesse.",
    },
    {
      title: "Tapis & moquette",
      description:
        "Couleurs ravivées et fibres assainies pour une durée de vie prolongée.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Résultats
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Des transformations visibles
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Chaque intervention est une vraie remise à neuf. Voici un aperçu de
            nos résultats.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {transformations.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              {/* Placeholder for before/after images */}
              <div className="relative h-48 bg-gradient-to-br from-rose-primary/10 via-rose-soft/40 to-slate-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold">
                      Avant
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-rose-primary"
                    >
                      <path d="M4 10h12M12 6l4 4-4 4" />
                    </svg>
                    <span className="rounded-full bg-rose-primary/10 px-3 py-1 text-xs font-semibold text-rose-primary">
                      Après
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 md:text-sm">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
