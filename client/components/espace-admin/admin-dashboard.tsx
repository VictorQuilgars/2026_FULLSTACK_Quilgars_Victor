"use client";

import { useState } from "react";
import type { AuthUser } from "@/types/auth";
import type { AdminAppointment } from "@/types/admin";
import type { AppointmentStatus } from "@/types/appointment";
import { ProfileSection } from "@/components/espace-client/profile-section";
import { AdminCalendar } from "@/components/espace-admin/admin-calendar";
import { UsersTab } from "@/components/espace-admin/users-tab";

type AdminDashboardProps = {
  user: AuthUser;
  initialAppointments: AdminAppointment[];
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

const FILTERS: { key: AppointmentStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "PENDING", label: "En attente" },
  { key: "CONFIRMED", label: "Confirmés" },
  { key: "DONE", label: "Terminés" },
  { key: "CANCELLED", label: "Annulés" },
];

function ActionButton({
  label,
  variant,
  loading,
  onClick,
}: {
  label: string;
  variant: "green" | "red" | "blue";
  loading: boolean;
  onClick: () => void;
}) {
  const styles = {
    green: "border-green-300 text-green-700 hover:bg-green-50",
    red: "border-red-300 text-red-600 hover:bg-red-50",
    blue: "border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${styles[variant]}`}
    >
      {loading ? "…" : label}
    </button>
  );
}

function AppointmentRow({
  appointment,
  isSuperAdmin,
  onUpdated,
}: {
  appointment: AdminAppointment;
  isSuperAdmin: boolean;
  onUpdated: (updated: AdminAppointment) => void;
}) {
  const [loadingStatus, setLoadingStatus] = useState<AppointmentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (status: AppointmentStatus) => {
    setLoadingStatus(status);
    setError(null);
    try {
      const res = await fetch(`/api/admin/appointments/${appointment.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Erreur.");
        return;
      }
      const updated: AdminAppointment = await res.json();
      onUpdated(updated);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoadingStatus(null);
    }
  };

  const dateFormatted = new Date(appointment.date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {appointment.service.nom}
            {appointment.gamme && (
              <span className="ml-1.5 text-xs font-normal text-slate-500">
                · {appointment.gamme}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 capitalize">
            {dateFormatted} à {appointment.slot}
            <span className="mx-1.5 text-slate-300">·</span>
            {appointment.service.dureeMinutes} min
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="font-semibold text-rose-primary">{appointment.prix} €</span>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[appointment.status]}`}
        >
          {STATUS_LABEL[appointment.status]}
        </span>
      </div>

      {/* Client + Staff info */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
        <span>
          <span className="font-medium text-slate-700">Client :</span>{" "}
          {appointment.client.prenom} {appointment.client.nom}
          {appointment.client.tel && (
            <a
              href={`tel:${appointment.client.tel}`}
              className="ml-1.5 text-rose-primary hover:underline"
            >
              {appointment.client.tel}
            </a>
          )}
        </span>
        {isSuperAdmin && appointment.staff && (
          <span>
            <span className="font-medium text-slate-700">Technicien :</span>{" "}
            {appointment.staff.prenom} {appointment.staff.nom}
            {appointment.staff.role && (
              <span className="text-slate-400"> · {appointment.staff.role}</span>
            )}
          </span>
        )}
      </div>

      {/* Actions */}
      {(appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
        <div className="flex flex-wrap gap-2 pt-1">
          {appointment.status === "PENDING" && (
            <>
              <ActionButton
                label="Confirmer"
                variant="green"
                loading={loadingStatus === "CONFIRMED"}
                onClick={() => changeStatus("CONFIRMED")}
              />
              <ActionButton
                label="Refuser"
                variant="red"
                loading={loadingStatus === "CANCELLED"}
                onClick={() => changeStatus("CANCELLED")}
              />
            </>
          )}
          {appointment.status === "CONFIRMED" && (
            <>
              <ActionButton
                label="Marquer comme terminé"
                variant="blue"
                loading={loadingStatus === "DONE"}
                onClick={() => changeStatus("DONE")}
              />
              <ActionButton
                label="Annuler"
                variant="red"
                loading={loadingStatus === "CANCELLED"}
                onClick={() => changeStatus("CANCELLED")}
              />
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function AdminDashboard({ user, initialAppointments }: AdminDashboardProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | "ALL">("PENDING");
  const [activeTab, setActiveTab] = useState<"reservations" | "utilisateurs" | "profil">("reservations");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const isSuperAdmin = currentUser.droit === "ADMIN";

  const handleUpdated = (updated: AdminAppointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a)),
    );
  };

  const filtered = appointments
    .filter((a) => filter === "ALL" || a.status === filter)
    .filter((a) => !selectedDate || new Date(a.date).toISOString().slice(0, 10) === selectedDate);

  const countByStatus = (s: AppointmentStatus | "ALL") =>
    s === "ALL" ? appointments.length : appointments.filter((a) => a.status === s).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isSuperAdmin ? "Administration" : "Mes interventions"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isSuperAdmin
              ? "Tous les rendez-vous · gestion complète"
              : `${currentUser.prenom} ${currentUser.nom} · ${currentUser.role ?? "Technicien"}`}
          </p>
        </div>
        <a
          href="/auth/logout"
          className="shrink-0 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
        >
          Se déconnecter
        </a>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-xl bg-slate-100 p-1">
        {([
          { key: "reservations", label: "Réservations" },
          ...(isSuperAdmin ? [{ key: "utilisateurs", label: "Utilisateurs" }] : []),
          { key: "profil", label: "Profil" },
        ] as { key: "reservations" | "utilisateurs" | "profil"; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab : Réservations */}
      {activeTab === "reservations" && (
        <div className="mt-6 flex gap-6">
          {/* Left : filters + list */}
          <div className="min-w-0 flex-1">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const count = countByStatus(f.key);
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-rose-primary bg-rose-soft/50 text-rose-primary"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span
                        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                          active ? "bg-rose-primary text-white" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active date filter badge */}
            {selectedDate && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Filtre date :{" "}
                  <span className="font-medium text-slate-700">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", {
                      weekday: "long", day: "numeric", month: "long",
                    })}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-rose-primary hover:underline"
                >
                  Effacer
                </button>
              </div>
            )}

            {/* List */}
            <div className="mt-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-sm text-slate-500">Aucun rendez-vous dans cette catégorie.</p>
                </div>
              ) : (
                filtered.map((a) => (
                  <AppointmentRow
                    key={a.id}
                    appointment={a}
                    isSuperAdmin={isSuperAdmin}
                    onUpdated={handleUpdated}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right : calendar (desktop only) */}
          <div className="hidden w-72 shrink-0 lg:block">
            <AdminCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>
      )}

      {/* Tab : Utilisateurs */}
      {activeTab === "utilisateurs" && isSuperAdmin && (
        <div className="mt-6">
          <UsersTab currentUser={currentUser} />
        </div>
      )}

      {/* Tab : Profil */}
      {activeTab === "profil" && (
        <div className="mt-6">
          <ProfileSection user={currentUser} onUserUpdated={setCurrentUser} />
        </div>
      )}
    </div>
  );
}
