import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-soft/80 via-white to-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-rose-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-rose-strong/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:flex-row md:items-center md:py-28">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-primary" />
            Nettoyage textile à domicile &middot; Brest et alentours
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Plus qu&apos;un nettoyage,
            <span className="mt-1 block font-black text-rose-primary">
              une vraie transformation.
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted sm:text-base leading-relaxed">
            Redonnez de l&apos;éclat à vos tapis, retrouvez l&apos;odeur du neuf
            dans votre voiture et assurez une hygiène irréprochable à vos
            canapés et matelas. Avec Roz Nettoyage, la propreté professionnelle
            est à portée de tous.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/particuliers"
              className="inline-flex items-center justify-center rounded-full bg-rose-gradient px-6 py-3 text-sm font-semibold text-white shadow-rose-lg transition hover:scale-[1.02]"
            >
              Découvrir nos prestations
            </Link>
            <Link
              href="/professionnels"
              className="inline-flex items-center justify-center rounded-full border border-rose-primary/30 px-6 py-3 text-sm font-semibold text-rose-primary transition hover:bg-rose-soft/60"
            >
              Offre professionnels
            </Link>
          </div>

          <dl className="flex flex-wrap gap-8 pt-2 text-xs text-muted sm:text-sm">
            <div>
              <dt className="text-2xl font-black text-ink">+200</dt>
              <dd>véhicules et textiles nettoyés</dd>
            </div>
            <div>
              <dt className="text-2xl font-black text-ink">+1 an</dt>
              <dd>d&apos;activité</dd>
            </div>
            <div>
              <dt className="text-2xl font-black text-ink">2</dt>
              <dd>contrats professionnels</dd>
            </div>
          </dl>
        </div>

        <div className="flex-1">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-rose-primary/20 bg-gradient-to-br from-rose-primary via-rose-strong to-ink shadow-2xl md:h-96">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_white/30,_transparent_60%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_black/40,_transparent_55%)]" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/70 p-4 text-xs text-slate-100 backdrop-blur">
              <p className="font-semibold text-white">Avant / Après</p>
              <p className="mt-1">
                Votre intérieur comme neuf : sièges, tapis, canapé et matelas
                traités en profondeur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
