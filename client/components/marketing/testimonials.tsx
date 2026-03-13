export function Testimonials() {
  const reviews = [
    {
      name: "Marie L.",
      location: "Brest",
      text: "Mon canapé avait des taches que je pensais impossibles à enlever. Résultat impeccable, comme neuf !",
      rating: 5,
    },
    {
      name: "Thomas B.",
      location: "Guipavas",
      text: "Intervention rapide et professionnelle pour l'intérieur de ma voiture. Je recommande à 100%.",
      rating: 5,
    },
    {
      name: "Sophie M.",
      location: "Plouzané",
      text: "Tapis et matelas nettoyés en profondeur. L'équipe est ponctuelle, sympa et le résultat est top.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Témoignages
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Ce que nos clients disent de nous
          </h2>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5 text-rose-primary">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-sm text-slate-700 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </blockquote>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-slate-900">
                  {review.name}
                </p>
                <p className="text-xs text-slate-500">{review.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
