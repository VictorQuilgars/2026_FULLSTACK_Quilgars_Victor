const items = [
  {
    title: "Expertise locale",
    description:
      "Une équipe basée près de chez vous, qui connaît les attentes des particuliers et des professionnels de la région.",
    style: "bg-rose-gradient",
    titleColor: "text-white",
    textColor: "text-white/80",
  },
  {
    title: "Proximité & flexibilité",
    description:
      "Nous intervenons à domicile ou sur site, avec des créneaux adaptés à votre emploi du temps.",
    style: "bg-slate-900",
    titleColor: "text-white",
    textColor: "text-slate-400",
  },
  {
    title: "Qualité assurée",
    description:
      "Méthodes professionnelles, machines performantes et protocole rigoureux pour des résultats visibles.",
    style: "bg-rose-soft border border-rose-primary/20",
    titleColor: "text-slate-900",
    textColor: "text-slate-600",
  },
  {
    title: "Produits éco-responsables",
    description:
      "Des produits sélectionnés pour leur efficacité et leur impact limité sur l'environnement et votre santé.",
    style: "bg-white border border-slate-200",
    titleColor: "text-slate-900",
    textColor: "text-slate-600",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Pourquoi nous choisir ?
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Ce qui nous différencie
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Plus qu&apos;un simple lavage, un accompagnement complet pour
            redonner vie à vos textiles.
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className={`rounded-2xl p-6 ${item.style}`}>
              <h3 className={`text-base font-semibold md:text-lg ${item.titleColor}`}>
                {item.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${item.textColor}`}>
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
