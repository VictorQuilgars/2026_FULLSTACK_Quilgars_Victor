import Link from "next/link";

const services = [
  {
    slug: "interieur-voiture",
    number: "01",
    title: "Intérieur voiture",
    description:
      "Sièges, tapis, coffre et plastiques traités en profondeur. Injection-extraction pour un résultat immédiat.",
  },
  {
    slug: "canape-fauteuil",
    number: "02",
    title: "Canapé & fauteuil",
    description:
      "Taches, odeurs et acariens éliminés. Votre salon retrouve une hygiène irréprochable.",
  },
  {
    slug: "tapis-matelas",
    number: "03",
    title: "Tapis & matelas",
    description:
      "Couleurs ravivées et fibres assainies pour une durée de vie prolongée.",
  },
];

export function ServicesOverview() {
  return (
    <section className="bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
              Nos prestations
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Ce que nous nettoyons
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400 md:text-base">
              Textile automobile, mobilier et literie traités en profondeur à
              domicile ou sur site.
            </p>
          </div>
          <Link
            href="/particuliers"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white hover:text-slate-900 md:mt-0"
          >
            Voir toutes les prestations
          </Link>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((service, i) => (
            <article
              key={service.slug}
              className={`flex flex-col rounded-2xl p-6 ${
                i === 0
                  ? "bg-rose-gradient"
                  : "border border-white/10 bg-white/[0.06]"
              }`}
            >
              <span
                className={`text-3xl font-black tracking-tighter ${
                  i === 0 ? "text-white/30" : "text-rose-primary/50"
                }`}
              >
                {service.number}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">
                {service.title}
              </h3>
              <p
                className={`mt-2 flex-1 text-sm leading-relaxed ${
                  i === 0 ? "text-white/80" : "text-slate-400"
                }`}
              >
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
