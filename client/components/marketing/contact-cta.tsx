import Link from "next/link";

export function ContactCta() {
  return (
    <section className="bg-rose-gradient">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Prêt à transformer votre intérieur ?
          </h2>
          <p className="mt-2 max-w-xl text-sm md:text-base">
            Décrivez-nous votre besoin en quelques lignes. Nous vous répondons
            sous 24 heures avec un devis adapté.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/professionnels#devis"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-rose-primary shadow-md hover:bg-rose-soft transition"
          >
            Demander un devis gratuit
          </Link>
          <a
            href="tel:+33772103552"
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Appeler directement
          </a>
        </div>
      </div>
    </section>
  );
}
