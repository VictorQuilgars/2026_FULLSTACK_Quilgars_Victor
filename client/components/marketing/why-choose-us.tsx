export function WhyChooseUs() {
  const items = [
    {
      title: "Expertise locale",
      description:
        "Une équipe basée près de chez vous, qui connaît les attentes des particuliers et des professionnels de la région.",
    },
    {
      title: "Proximité & flexibilité",
      description:
        "Nous intervenons à domicile ou sur site, avec des créneaux adaptés à votre emploi du temps.",
    },
    {
      title: "Qualité assurée",
      description:
        "Méthodes professionnelles, machines performantes et protocole rigoureux pour des résultats visibles.",
    },
    {
      title: "Produits éco-responsables",
      description:
        "Des produits sélectionnés pour leur efficacité et leur impact limité sur l’environnement et votre santé.",
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Pourquoi nous faire confiance ?
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Pourquoi choisir Roz Nettoyage ?
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Plus qu&apos;un simple lavage, nous proposons un accompagnement
            complet pour redonner vie à vos textiles tout en respectant votre
            environnement.
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 md:text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

