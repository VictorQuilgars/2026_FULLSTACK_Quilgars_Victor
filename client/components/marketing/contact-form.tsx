export function ContactForm() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
              Devis gratuit
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Demandez votre devis personnalisé
            </h1>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Décrivez-nous votre besoin (type de prestation, lieu,
              disponibilité). Nous revenons vers vous sous 24 heures avec une
              proposition adaptée.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-700"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label
                    htmlFor="adresse"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Adresse postale
                  </label>
                  <input
                    id="adresse"
                    name="adresse"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="objet"
                  className="block text-xs font-medium text-slate-700"
                >
                  Objet de la demande
                </label>
                <input
                  id="objet"
                  name="objet"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-medium text-slate-700"
                >
                  Description de votre besoin
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Exemple : &quot;Nettoyage intérieur voiture + tapis salon, à
                  Brest, plutôt en fin de journée ou le samedi.&quot;
                </p>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-md hover:scale-[1.01]"
              >
                Envoyer ma demande
              </button>

              <p className="mt-2 text-xs text-slate-500">
                En cliquant sur &quot;Envoyer ma demande&quot;, vous acceptez
                que Roz Nettoyage vous contacte par e-mail ou téléphone pour
                répondre à votre demande de devis.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

