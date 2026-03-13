import Link from "next/link";

export function ServicesOverview() {
  const services = [
    {
      slug: "interieur-voiture",
      title: "Intérieur voiture",
      description:
        "Redécouvrez le confort d’un habitacle propre : sièges, tapis, coffres et plastiques traités en profondeur.",
    },
    {
      slug: "canape-fauteuil",
      title: "Canapé & fauteuil",
      description:
        "Nous éliminons taches, odeurs et acariens pour un salon plus sain et plus accueillant.",
    },
    {
      slug: "tapis-matelas",
      title: "Tapis & matelas",
      description:
        "Un nettoyage qui ravive les couleurs, assainit les fibres et prolonge la durée de vie de vos textiles.",
    },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
              Nos prestations
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Nos services de nettoyage textile
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600 md:text-base">
              Nous intervenons sur les surfaces textiles les plus exposées de
              votre quotidien pour une transformation visible, durable et
              hygiénique.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-rose-primary/40 px-5 py-2 text-xs font-semibold text-rose-primary hover:bg-rose-gradient hover:text-white md:mt-0"
          >
            Voir le détail des prestations
          </Link>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 md:text-sm">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

