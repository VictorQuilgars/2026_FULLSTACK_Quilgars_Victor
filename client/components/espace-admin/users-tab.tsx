"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/types/auth";
import type { AdminAppointment } from "@/types/admin";
import type { AppointmentStatus } from "@/types/appointment";

type AdminUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string | null;
  tel: string;
  droit: "USER" | "COLLABORATEUR" | "ADMIN";
  role: string | null;
  state: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  _count: { appointments: number; assignedTasks: number };
};

const DROIT_LABEL: Record<AdminUser["droit"], string> = {
  USER: "Client",
  COLLABORATEUR: "Collaborateur",
  ADMIN: "Admin",
};

const DROIT_STYLE: Record<AdminUser["droit"], string> = {
  USER: "bg-slate-100 text-slate-600",
  COLLABORATEUR: "bg-blue-100 text-blue-700",
  ADMIN: "bg-rose-100 text-rose-700",
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

function UserAppointmentsModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${user.id}/appointments`)
      .then((r) => r.json())
      .then((data) => setAppointments(data))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "white", borderRadius: "1rem", padding: "1.5rem", width: "min(90vw, 600px)", maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {user.prenom} {user.nom}
            </h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Chargement…</p>
        ) : appointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Aucun rendez-vous.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {a.service.nom}
                      {a.gamme && <span className="ml-1.5 text-xs text-slate-400">· {a.gamme}</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 capitalize">
                      {new Date(a.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} à {a.slot}
                      {a.prix && <span className="ml-2 font-semibold text-rose-primary">{a.prix} €</span>}
                    </p>
                    {a.staff && a.client.id !== user.id && (
                      <p className="mt-0.5 text-xs text-slate-400">Client : {a.client.prenom} {a.client.nom}</p>
                    )}
                    {a.staff && a.staff.id !== user.id && (
                      <p className="mt-0.5 text-xs text-slate-400">Technicien : {a.staff.prenom} {a.staff.nom}</p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({
  user,
  currentAdminId,
  onStateChanged,
  onDeleted,
  onViewAppointments,
}: {
  user: AdminUser;
  currentAdminId: string;
  onStateChanged: (updated: AdminUser) => void;
  onDeleted: (id: string) => void;
  onViewAppointments: (user: AdminUser) => void;
}) {
  const [loadingState, setLoadingState] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSelf = user.id === currentAdminId;

  const toggleState = async () => {
    setLoadingState(true);
    setError(null);
    const newState = user.state === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/users/${user.id}/state`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Erreur."); return; }
      onStateChanged(data);
    } catch { setError("Une erreur est survenue."); }
    finally { setLoadingState(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoadingDelete(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); setError(d.message ?? "Erreur."); return; }
      onDeleted(user.id);
    } catch { setError("Une erreur est survenue."); }
    finally { setLoadingDelete(false); setConfirmDelete(false); }
  };

  return (
    <div className={`rounded-xl border p-4 transition ${user.state === "SUSPENDED" ? "border-red-200 bg-red-50/40" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-slate-900">
              {user.prenom} {user.nom}
            </p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DROIT_STYLE[user.droit]}`}>
              {DROIT_LABEL[user.droit]}
            </span>
            {user.role && (
              <span className="text-xs text-slate-400">· {user.role}</span>
            )}
            {user.state === "SUSPENDED" && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Suspendu</span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{user.email ?? "—"}</p>
          {user.tel && <p className="text-xs text-slate-400">{user.tel}</p>}
          <p className="mt-1 text-xs text-slate-400">
            {user._count.appointments} RDV client
            {user.droit !== "USER" && ` · ${user._count.assignedTasks} interventions assignées`}
            {" · "}Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => onViewAppointments(user)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Voir RDV
          </button>
          {!isSelf && (
            <>
              <button
                type="button"
                onClick={toggleState}
                disabled={loadingState}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                  user.state === "ACTIVE"
                    ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                }`}
              >
                {loadingState ? "…" : user.state === "ACTIVE" ? "Suspendre" : "Réactiver"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loadingDelete}
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
              >
                {loadingDelete ? "…" : confirmDelete ? "Confirmer ?" : "Supprimer"}
              </button>
              {confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Annuler
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

type Filter = "ALL" | "USER" | "COLLABORATEUR" | "ADMIN";

export function UsersTab({ currentUser }: { currentUser: AuthUser }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? users : users.filter((u) => u.droit === filter);

  const count = (f: Filter) =>
    f === "ALL" ? users.length : users.filter((u) => u.droit === f).length;

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "ALL", label: "Tous" },
    { key: "USER", label: "Clients" },
    { key: "COLLABORATEUR", label: "Collaborateurs" },
    { key: "ADMIN", label: "Admins" },
  ];

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
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
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${active ? "bg-rose-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                {count(f.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">Chargement…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Aucun utilisateur dans cette catégorie.</p>
          </div>
        ) : (
          filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              currentAdminId={currentUser.id}
              onStateChanged={(updated) =>
                setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
              }
              onDeleted={(id) => setUsers((prev) => prev.filter((x) => x.id !== id))}
              onViewAppointments={setSelectedUser}
            />
          ))
        )}
      </div>

      {selectedUser && (
        <UserAppointmentsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
