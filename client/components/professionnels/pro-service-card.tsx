type ProServiceProps = {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
};

const iconMap: Record<string, React.ReactNode> = {
  moquette: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-rose-primary"
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 6V4M18 6V4M2 12h20" />
    </svg>
  ),
  terrasse: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-rose-primary"
    >
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  ),
  automobile: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-rose-primary"
    >
      <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  textile: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-rose-primary"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

export function ProServiceCard({ service }: ProServiceProps) {
  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-soft">
        {iconMap[service.icon] ?? (
          <div className="h-6 w-6 rounded-full bg-rose-primary/20" />
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          {service.title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 md:text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </article>
  );
}
