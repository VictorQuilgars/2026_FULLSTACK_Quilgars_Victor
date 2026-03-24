"use client";

import { useState, useEffect } from "react";

type BlockedSlot = {
  id: number;
  date: string;
  slot: string | null;
  reason: string | null;
  createdAt: string;
};

const SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30",
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function groupByDate(blocks: BlockedSlot[]) {
  const map = new Map<string, BlockedSlot[]>();
  for (const b of blocks) {
    const key = b.date.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(b);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function BlockedSlotsTab() {
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", dateFin: "", slot: "", reason: "", type: "day" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/blocked-slots")
      .then((r) => r.json())
      .then((data) => setBlocks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.date) { setError("La date est obligatoire."); return; }
    if (form.type === "slot" && !form.slot) { setError("Choisissez un créneau."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          ...(form.type === "day" && form.dateFin ? { dateFin: form.dateFin } : {}),
          slot: form.type === "slot" ? form.slot : null,
          reason: form.reason || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? "Erreur."); return; }

      const newBlocks: BlockedSlot[] = data.created ?? [data];
      setBlocks((prev) => [...prev, ...newBlocks].sort((a, b) => a.date.localeCompare(b.date)));

      const count = newBlocks.length;
      const skipped = data.skipped?.length ?? 0;
      if (form.type === "day") {
        setSuccess(`${count} jour${count > 1 ? "s" : ""} fermé${count > 1 ? "s" : ""}${skipped > 0 ? ` (${skipped} déjà bloqué${skipped > 1 ? "s" : ""})` : ""}.`);
      } else {
        setSuccess(`Créneau ${form.slot} bloqué.`);
      }
      setForm((f) => ({ ...f, date: "", dateFin: "", slot: "", reason: "" }));
    } catch { setError("Une erreur est survenue."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/blocked-slots/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    } catch { /* silent */ }
  };

  const today = new Date().toISOString().slice(0, 10);
  const grouped = groupByDate(blocks);
  const upcoming = grouped.filter(([d]) => d >= today);
  const past = grouped.filter(([d]) => d < today);

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Ajouter une fermeture</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Type */}
          <div className="flex gap-2">
            {[
              { value: "day", label: "Journée entière" },
              { value: "slot", label: "Créneau spécifique" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  form.type === t.value
                    ? "border-rose-primary bg-rose-soft/50 text-rose-primary"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Date début */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-500">
                {form.type === "day" ? "Du" : "Date"}
              </span>
              <input
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, dateFin: f.dateFin && f.dateFin < e.target.value ? e.target.value : f.dateFin }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-primary"
              />
            </label>

            {/* Date fin (journée entière seulement) */}
            {form.type === "day" && (
              <label className="block">
                <span className="block text-xs font-medium text-slate-500">Au (optionnel)</span>
                <input
                  type="date"
                  min={form.date || today}
                  value={form.dateFin}
                  onChange={(e) => setForm((f) => ({ ...f, dateFin: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-primary"
                />
              </label>
            )}

            {/* Créneau (si type slot) */}
            {form.type === "slot" && (
              <label className="block">
                <span className="block text-xs font-medium text-slate-500">Créneau</span>
                <select
                  value={form.slot}
                  onChange={(e) => setForm((f) => ({ ...f, slot: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-primary"
                >
                  <option value="">— Choisir —</option>
                  {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}

            {/* Motif */}
            <label className="block">
              <span className="block text-xs font-medium text-slate-500">Motif (optionnel)</span>
              <input
                type="text"
                placeholder="Congés, Jour férié…"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-primary"
              />
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-rose-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? "Enregistrement…"
              : form.type === "slot"
              ? "Bloquer ce créneau"
              : form.dateFin && form.dateFin !== form.date
              ? "Fermer cette période"
              : "Fermer cette journée"}
          </button>
        </form>
      </div>

      {/* Liste */}
      {loading ? (
        <p className="py-8 text-center text-sm text-slate-400">Chargement…</p>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-700">À venir</h3>
              <div className="space-y-3">
                {upcoming.map(([dateKey, items]) => (
                  <DayBlock key={dateKey} dateKey={dateKey} items={items} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-400">Passés</h3>
              <div className="space-y-2 opacity-60">
                {past.map(([dateKey, items]) => (
                  <DayBlock key={dateKey} dateKey={dateKey} items={items} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {blocks.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm text-slate-400">Aucune fermeture planifiée.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DayBlock({
  dateKey,
  items,
  onDelete,
}: {
  dateKey: string;
  items: BlockedSlot[];
  onDelete: (id: number) => void;
}) {
  const hasFullDay = items.some((i) => i.slot === null);
  return (
    <div className={`rounded-xl border p-4 ${hasFullDay ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 capitalize">{formatDate(dateKey)}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.slot === null
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.slot === null ? "Journée fermée" : item.slot}
                {item.reason && <span className="text-slate-400">· {item.reason}</span>}
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="ml-0.5 text-slate-400 hover:text-red-600 transition"
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
