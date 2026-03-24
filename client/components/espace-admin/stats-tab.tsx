"use client";

import { useState, useEffect } from "react";

type Stats = {
  ca: { total: number; week: number; month: number; year: number };
  appointments: {
    total: number;
    PENDING: number;
    CONFIRMED: number;
    DONE: number;
    CANCELLED: number;
    cancellationRate: number;
  };
  topServices: { nom: string; count: number; revenue: number }[];
  monthly: { month: string; rdv: number; ca: number }[];
};

function KpiCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function MonthlyBar({ data }: { data: Stats["monthly"] }) {
  const maxRdv = Math.max(...data.map((d) => d.rdv), 1);
  const maxCa = Math.max(...data.map((d) => d.ca), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">Évolution sur 6 mois</h3>
      <div className="mt-4 flex items-end justify-between gap-2">
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
            {/* CA bar */}
            <div className="relative w-full">
              <div
                className="w-full rounded-t bg-rose-primary/20 transition-all"
                style={{ height: `${Math.round((d.ca / maxCa) * 80) + 4}px` }}
              />
              <div
                className="absolute bottom-0 w-full rounded-t bg-rose-primary transition-all"
                style={{ height: `${Math.round((d.rdv / maxRdv) * 80) + 4}px`, opacity: 0.7 }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded bg-rose-primary/70" /> RDV terminés
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded bg-rose-primary/20" /> CA (€)
        </span>
      </div>
    </div>
  );
}

export function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-16 text-center text-sm text-slate-400">Chargement des statistiques…</p>;
  }

  if (!stats) {
    return <p className="py-16 text-center text-sm text-red-500">Impossible de charger les statistiques.</p>;
  }

  const maxCount = Math.max(...stats.topServices.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      {/* CA cards */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Chiffre d&apos;affaires</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="Cette semaine" value={`${stats.ca.week} €`} color="border-slate-200 bg-white" />
          <KpiCard label="Ce mois" value={`${stats.ca.month} €`} color="border-slate-200 bg-white" />
          <KpiCard label="Cette année" value={`${stats.ca.year} €`} color="border-slate-200 bg-white" />
          <KpiCard label="Total" value={`${stats.ca.total} €`} color="border-rose-primary/20 bg-rose-soft/30" />
        </div>
      </div>

      {/* RDV cards */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Rendez-vous</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard label="En attente" value={String(stats.appointments.PENDING)} color="border-yellow-200 bg-yellow-50" />
          <KpiCard label="Confirmés" value={String(stats.appointments.CONFIRMED)} color="border-green-200 bg-green-50" />
          <KpiCard label="Terminés" value={String(stats.appointments.DONE)} color="border-slate-200 bg-white" />
          <KpiCard
            label="Taux d'annulation"
            value={`${stats.appointments.cancellationRate} %`}
            sub={`${stats.appointments.CANCELLED} annulé(s) / ${stats.appointments.total} total`}
            color="border-red-200 bg-red-50"
          />
        </div>
      </div>

      {/* Monthly chart + top services */}
      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyBar data={stats.monthly} />

        {/* Top services */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">Services les plus demandés</h3>
          <div className="mt-4 space-y-3">
            {stats.topServices.map((s) => (
              <div key={s.nom}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[60%]">{s.nom}</span>
                  <span className="text-slate-400">
                    {s.count} RDV
                    {s.revenue > 0 && <span className="ml-2 font-semibold text-rose-primary">{s.revenue} €</span>}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-rose-primary transition-all"
                    style={{ width: `${Math.round((s.count / maxCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
