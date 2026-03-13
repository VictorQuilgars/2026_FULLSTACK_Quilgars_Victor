export function AboutSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
              Qui sommes-nous ?
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Une équipe jeune et engagée
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Roz Nettoyage, c&apos;est la rencontre entre la gestion de
              projet, la rigueur HSE et la passion du service client. Une
              structure locale qui met en avant la proximité et la qualité.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 md:text-sm">
            <p>
              Étudiant en master 1 Gestion à l&apos;IAE de Brest, Barnabé pilote
              le développement de l&apos;activité et veille à la bonne
              organisation des interventions ainsi qu&apos;au suivi des
              clients.
            </p>
            <p>
              Étudiant en troisième année de BUT Hygiène, Sécurité,
              Environnement, Julian apporte son expertise sur les produits, les
              procédés de nettoyage et les aspects HSE, pour garantir des
              prestations efficaces et sûres.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

