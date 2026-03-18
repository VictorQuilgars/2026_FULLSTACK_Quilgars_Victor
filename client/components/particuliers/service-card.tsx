import Image from "next/image";
import Link from "next/link";

function getServiceImage(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("angle")) return "/images/services/canape-angle.jpg";
  if (t.includes("canapé") || t.includes("canape")) return "/images/services/canape-classique.png";
  if (t.includes("fauteuil")) return "/images/services/fauteuil.jpg";
  if (t.includes("voiture")) return "/images/services/int-voiture.png";
  if (t.includes("tapis")) return "/images/services/tapis.png";
  return null;
}

type ServiceProps = {
  service: {
    id: number;
    title: string;
    description: string;
    duration: string;
    price: number;
    image: string | null;
  };
};

export function ServiceCard({ service }: ServiceProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {(() => {
          const img = service.image ?? getServiceImage(service.title);
          return img ? (
            <Image src={img} alt={service.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-primary/10 via-rose-soft/40 to-slate-100 flex items-center justify-center text-sm text-slate-400">
              Photo à venir
            </div>
          );
        })()}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-slate-900">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-xs text-slate-600 md:text-sm leading-relaxed">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Durée :</span>{" "}
            {service.duration}
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-rose-primary">
              {service.price} &euro;
            </span>
          </div>
        </div>

        <Link
          href={`/espace-client/reserver?serviceId=${service.id}`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-rose-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
        >
          Réserver
        </Link>
      </div>
    </article>
  );
}
