import { ServiceCard } from "./service-card";

const services = [
  {
    id: 1,
    title: "Intérieur Voiture",
    description:
      "Nettoyage complet de l'habitacle : sièges, tapis, coffre, plastiques. Injection-extraction pour un résultat en profondeur.",
    duration: "2h",
    price: 99,
    image: null,
  },
  {
    id: 2,
    title: "Canapé Classique",
    description:
      "Nettoyage intégral de votre canapé classique (2 ou 3 places) : taches, odeurs et acariens éliminés.",
    duration: "1h",
    price: 99,
    image: null,
  },
  {
    id: 3,
    title: "Canapé d'Angles",
    description:
      "Nettoyage de votre canapé d'angle en profondeur. Même technique, surface plus grande couverte.",
    duration: "1h",
    price: 109,
    image: null,
  },
  {
    id: 4,
    title: "Tapis",
    description:
      "Injection-extraction sur tapis de toutes tailles. Couleurs ravivées, fibres assainies et odeurs neutralisées.",
    duration: "3h",
    price: 99,
    image: null,
  },
  {
    id: 5,
    title: "Fauteuil",
    description:
      "Nettoyage en profondeur de votre fauteuil textile. Idéal pour les assises du quotidien.",
    duration: "1h",
    price: 60,
    image: null,
  },
];

export function ParticuliersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-soft/80 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Particuliers
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Nos prestations pour particuliers
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base leading-relaxed">
            Roz Nettoyage propose des prestations de nettoyage textile à
            domicile pour les particuliers de Brest et alentours. Choisissez
            votre prestation et réservez directement en ligne.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-12 text-center text-white">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Une question ? Un besoin spécifique ?
          </h2>
          <p className="max-w-lg text-sm md:text-base">
            Contactez-nous par téléphone pour un devis personnalisé ou pour
            toute question sur nos services.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+33772103552"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-md hover:bg-slate-100 transition"
            >
              07 72 10 35 52
            </a>
            <a
              href="tel:+33602243720"
              className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              06 02 24 37 20
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
