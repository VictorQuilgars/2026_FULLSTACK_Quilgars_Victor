import Image from "next/image";

const transformations = [
  {
    title: "Intérieur voiture",
    description:
      "Sièges, tapis et plastiques traités en profondeur pour un résultat visible immédiatement.",
    before: "/images/before-after/voiture-before.png",
    after: "/images/before-after/voiture-after.png",
  },
  {
    title: "Canapé textile",
    description:
      "Taches, odeurs et acariens éliminés. Votre salon retrouve une seconde jeunesse.",
    before: "/images/before-after/canape-before.jpg",
    after: "/images/before-after/canape-after.jpg",
  },
  {
    title: "Tapis & moquette",
    description:
      "Couleurs ravivées et fibres assainies pour une durée de vie prolongée.",
    before: null,
    after: null,
  },
];

export function BeforeAfter() {
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

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {transformations.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {item.before && item.after ? (
                  <>
                    {/* Moitié gauche : Avant */}
                    <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                      <Image
                        src={item.before}
                        alt={`${item.title} avant`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Moitié droite : Après */}
                    <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                      <Image
                        src={item.after}
                        alt={`${item.title} après`}
                        fill
                        className="object-cover object-right"
                      />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-primary/10 to-slate-400/20" />
                )}
                {/* Split line */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/80" />
                <div className="absolute inset-0 flex items-center justify-between px-5">
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Avant
                  </span>
                  <span className="rounded-full bg-rose-primary px-3 py-1 text-xs font-semibold text-white">
                    Après
                  </span>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow"
                  >
                    <path d="M8 12h8M12 8l4 4-4 4" />
                  </svg>
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
