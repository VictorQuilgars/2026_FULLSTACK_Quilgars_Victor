import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-rose-soft/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:py-20">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-rose-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-primary" />
            Nettoyage textile à domicile · Brest et alentours
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Plus qu&apos;un nettoyage,
            <span className="mt-1 block font-black text-rose-primary">
              une vraie transformation.
            </span>
          </h1>

          <p className="max-w-xl text-sm text-muted sm:text-base">
            Redonnez de l&apos;éclat à vos tapis, retrouvez l&apos;odeur du neuf
            dans votre voiture et assurez une hygiène irréprochable à vos
            canapés et matelas. Avec Roz Nettoyage, la propreté professionnelle
            est à portée de tous.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-lg transition hover:scale-[1.02]"
            >
              Demander un devis gratuit
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-rose-primary underline-offset-4 hover:underline"
            >
              Découvrir nos prestations
            </Link>
          </div>

          <dl className="flex flex-wrap gap-6 text-xs text-muted sm:text-sm">
            <div>
              <dt className="text-lg font-semibold text-ink">+200</dt>
              <dd>véhicules et textiles nettoyés</dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-ink">+1</dt>
              <dd>an d&apos;activité</dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-ink">2</dt>
              <dd>contrats avec des professionnels</dd>
            </div>
          </dl>
        </div>

        <div className="flex-1">
          <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-rose-primary/30 bg-gradient-to-br from-rose-primary via-rose-strong to-ink shadow-2xl md:h-80">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_white/30,_transparent_60%)] opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_black/40,_transparent_55%)]" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/70 p-4 text-xs text-slate-100 backdrop-blur">
              Votre intérieur comme neuf : sièges, tapis, canapé et matelas
              traités en profondeur pour une hygiène durable.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

