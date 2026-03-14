const reviews = [
  {
    name: "Marie L.",
    location: "Brest",
    text: "Mon canapé avait des taches que je pensais impossibles à enlever. Résultat impeccable, comme neuf !",
    style: "bg-slate-900",
    textColor: "text-slate-300",
    nameColor: "text-white",
    locationColor: "text-slate-400",
    starColor: "text-rose-primary",
  },
  {
    name: "Thomas B.",
    location: "Guipavas",
    text: "Intervention rapide et professionnelle pour l'intérieur de ma voiture. Je recommande à 100%.",
    style: "bg-rose-soft border border-rose-primary/20",
    textColor: "text-slate-700",
    nameColor: "text-slate-900",
    locationColor: "text-slate-500",
    starColor: "text-rose-primary",
  },
  {
    name: "Sophie M.",
    location: "Plouzané",
    text: "Tapis et matelas nettoyés en profondeur. L'équipe est ponctuelle, sympa et le résultat est top.",
    style: "bg-white border border-slate-200",
    textColor: "text-slate-700",
    nameColor: "text-slate-900",
    locationColor: "text-slate-500",
    starColor: "text-rose-primary",
  },
];

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export function Testimonials() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Témoignages
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Ce que nos clients disent
          </h2>
        </header>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className={`flex flex-col rounded-2xl p-6 ${review.style}`}
            >
              <div className={`flex gap-0.5 ${review.starColor}`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              <blockquote className={`mt-4 flex-1 text-sm leading-relaxed ${review.textColor}`}>
                &ldquo;{review.text}&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-primary text-xs font-bold text-white">
                  {review.name[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${review.nameColor}`}>
                    {review.name}
                  </p>
                  <p className={`text-xs ${review.locationColor}`}>
                    {review.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
