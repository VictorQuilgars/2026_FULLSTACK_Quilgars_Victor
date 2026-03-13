import { ProServiceCard } from "./pro-service-card";
import { SubscriptionSection } from "./subscription-section";
import { ContactForm } from "@/components/marketing/contact-form";

const proServices = [
  {
    id: 1,
    title: "Nettoyage de moquette",
    description:
      "Vos sols reflètent l'image de votre entreprise. Notre technique d'injection-extraction redonne vie aux moquettes des zones de passage intensif : halls d'accueil, bureaux, salles de réunion.",
    icon: "moquette",
  },
  {
    id: 2,
    title: "Nettoyage de terrasse",
    description:
      "Éliminez mousses, lichens et salissures pour retrouver des terrasses propres et sécurisées. Idéal pour les restaurants, hôtels et espaces d'accueil extérieurs.",
    icon: "terrasse",
  },
  {
    id: 3,
    title: "Nettoyage automobile",
    description:
      "Pour les flottes de véhicules commerciaux, taxis et VTC : nettoyage intérieur complet sur votre parking ou dépôt. Sièges, tapis, plastiques traités en profondeur.",
    icon: "automobile",
  },
  {
    id: 4,
    title: "Nettoyage Canapé-Textiles",
    description:
      "Chaises, banquettes d'accueil, fauteuils de salle d'attente : nous nettoyons et assainissons le mobilier textile de vos espaces professionnels.",
    icon: "textile",
  },
];

export function ProfessionnelsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-soft/80 via-white to-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-primary/8 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Professionnels
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Nos services
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base leading-relaxed">
            Roz Nettoyage propose diverses prestations de nettoyage destinées
            aux professionnels (concessions automobiles, hôtels, restaurants,
            espaces de coworking...).
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {proServices.map((service) => (
              <ProServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Subscription section */}
      <SubscriptionSection />

      {/* Devis form */}
      <div id="devis">
        <ContactForm />
      </div>
    </>
  );
}
