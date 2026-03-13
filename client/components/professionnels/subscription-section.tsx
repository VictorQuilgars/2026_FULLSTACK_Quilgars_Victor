export function SubscriptionSection() {
  const benefits = [
    {
      title: "Chrono 24h Max",
      description:
        "Intervention garantie sur site dans les 24 heures suivant votre appel. Pas d'attente, pas de retard.",
      bg: "bg-slate-900 text-white",
      titleColor: "text-white",
      descColor: "text-slate-300",
    },
    {
      title: "SOS Taches & Dégâts",
      description:
        "Un incident ? Tache de vin, vomissure, dégât des eaux sur textile... Nous gérons l'urgence pour vous.",
      bg: "bg-slate-100",
      titleColor: "text-slate-900",
      descColor: "text-slate-600",
    },
    {
      title: "Priorité Absolue",
      description:
        "Les abonnés passent en premier. Ligne directe dédiée, disponible 7j/7 pour vos demandes urgentes.",
      bg: "bg-white border border-slate-200",
      titleColor: "text-slate-900",
      descColor: "text-slate-600",
    },
    {
      title: "0% Perte de C.A.",
      description:
        "Un espace sale fait fuir les clients. L'abonnement se rentabilise dès le premier sauvetage.",
      bg: "bg-rose-gradient text-white",
      titleColor: "text-white",
      descColor: "text-white/80",
    },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Abonnement
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            L&apos;abonnement à la Roz-cousse !
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Un abonnement pensé pour les professionnels qui ne peuvent pas se
            permettre de perdre de temps (ou de clients) à cause d&apos;un
            incident.
          </p>
        </header>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className={`rounded-2xl p-6 shadow-sm ${benefit.bg}`}
            >
              <h3 className={`text-lg font-bold ${benefit.titleColor}`}>
                {benefit.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${benefit.descColor}`}
              >
                {benefit.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="#devis"
            className="inline-flex items-center justify-center rounded-full bg-rose-gradient px-8 py-3 text-sm font-semibold text-white shadow-rose-lg transition hover:scale-[1.02]"
          >
            Demander un devis abonnement
          </a>
        </div>
      </div>
    </section>
  );
}
