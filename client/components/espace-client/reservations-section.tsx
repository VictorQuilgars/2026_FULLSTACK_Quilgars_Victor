import Link from "next/link";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

type ReservationsSectionProps = {
  appointments: Appointment[];
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DONE: "Terminé",
  CANCELLED: "Annulé",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  DONE: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-700",
};

const UPCOMING_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED"];

export function ReservationsSection({
  appointments,
}: ReservationsSectionProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-soft text-rose-primary">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Aucune réservation
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Vous n&apos;avez pas encore de réservation. Découvrez nos prestations
          et réservez en quelques clics.
        </p>
        <Link
          href="/espace-client/reserver"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
        >
          Réserver une prestation
        </Link>
      </div>
    );
  }

  const upcoming = appointments.filter((a) =>
    UPCOMING_STATUSES.includes(a.status),
  );
  const past = appointments.filter(
    (a) => !UPCOMING_STATUSES.includes(a.status),
  );

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            À venir
          </h3>
          <div className="mt-3 space-y-3">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Passées
          </h3>
          <div className="mt-3 space-y-3">
            {past.map((a) => (
              <AppointmentCard key={a.id} appointment={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {appointment.service.nom}
          {appointment.gamme && (
            <span className="ml-1.5 text-xs font-normal text-slate-500">
              · {appointment.gamme}
            </span>
          )}
        </p>
        <p className="text-xs text-slate-500">
          {new Date(appointment.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          à {appointment.slot}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-rose-primary">
          {appointment.prix}&euro;
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[appointment.status]}`}
        >
          {STATUS_LABEL[appointment.status]}
        </span>
      </div>
    </article>
  );
}
