export function PricingTeaser() {
  return (
    <section className="bg-slate-900 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Des prix clairs
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Des tarifs simples, sans surprise
          </h2>
          <p className="mt-3 text-sm text-slate-200 md:text-base">
            Les prix varient selon le type de véhicule ou de textile. Voici nos
            points de départ, avec un supplément modéré pour les
            interventions à domicile.
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-rose-primary/40 bg-slate-900/40 p-5 shadow-rose-lg">
            <h3 className="text-sm font-semibold text-slate-50">
              Intérieur voiture
            </h3>
            <p className="mt-1 text-xs text-slate-300">À partir de</p>
            <p className="mt-2 text-2xl font-semibold text-rose-primary">99 €</p>
            <p className="mt-2 text-xs text-slate-300">+5 € à domicile</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              Tapis & matelas
            </h3>
            <p className="mt-1 text-xs text-slate-300">À partir de</p>
            <p className="mt-2 text-2xl font-semibold text-rose-primary">89 €</p>
            <p className="mt-2 text-xs text-slate-300">+5 € à domicile</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
            <h3 className="text-sm font-semibold text-slate-50">
              Canapé & fauteuil
            </h3>
            <p className="mt-1 text-xs text-slate-300">À partir de</p>
            <p className="mt-2 text-2xl font-semibold text-rose-primary">79 €</p>
            <p className="mt-2 text-xs text-slate-300">+5 € à domicile</p>
          </article>
        </div>
      </div>
    </section>
  );
}

