import type { Service } from "@/types/service";

const formatStartingPrice = (prices: Service["prices"]): number | null => {
  const values = Object.values(prices);
  if (!values.length) return null;
  return Math.min(...values);
};

export function ServicesList({ services }: { services: Service[] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Prestations détaillées
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Nos services de nettoyage textile
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Les services ci-dessous sont directement issus de votre base de
            données. Les tarifs varient selon la catégorie (citadine, SUV,
            canapé 2 places, etc.).
          </p>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const startingPrice = formatStartingPrice(service.prices);

            return (
              <article
                key={service.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-sm"
              >
                <div>
                  <h2 className="text-base font-semibold text-slate-900 md:text-lg">
                    {service.nom}
                  </h2>
                  {service.description && (
                    <p className="mt-2 text-xs text-slate-600 md:text-sm">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-700 md:text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Durée estimée
                    </p>
                    <p className="mt-1">
                      Environ {service.dureeMinutes} minutes
                    </p>
                  </div>
                  {startingPrice !== null && (
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        À partir de
                      </p>
                      <p className="mt-1 text-lg font-semibold text-rose-primary">
                        {startingPrice.toFixed(0)} €
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

