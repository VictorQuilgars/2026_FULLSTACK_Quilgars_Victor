"use client";

import { useState } from "react";
import type { AdminAppointment } from "@/types/admin";
import type { AppointmentStatus } from "@/types/appointment";

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-400",
  CONFIRMED: "bg-green-400",
  DONE: "bg-slate-400",
  CANCELLED: "bg-red-400",
};

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

type Props = {
  appointments: AdminAppointment[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
};

export function AdminCalendar({ appointments, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Build a map: "YYYY-MM-DD" -> appointments[]
  const byDate = new Map<string, AdminAppointment[]>();
  for (const appt of appointments) {
    const key = new Date(appt.date).toISOString().slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(appt);
  }

  // Calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-based: 0=Mon ... 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = today.toISOString().slice(0, 10);

  const toKey = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-slate-900">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map((d, i) => (
          <span key={i} className="text-[11px] font-medium text-slate-400">
            {d}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = toKey(day);
          const appts = byDate.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : key)}
              className={`relative flex flex-col items-center rounded-xl py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "bg-rose-primary text-white"
                  : isToday
                  ? "bg-rose-soft/60 text-rose-primary"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {day}
              {appts.length > 0 && (
                <div className="mt-0.5 flex gap-0.5">
                  {appts.slice(0, 3).map((a, j) => (
                    <span
                      key={j}
                      className={`h-1 w-1 rounded-full ${
                        isSelected ? "bg-white/80" : STATUS_COLOR[a.status]
                      }`}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3">
        {(Object.entries(STATUS_COLOR) as [AppointmentStatus, string][]).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1 text-[11px] text-slate-500">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            {{ PENDING: "En attente", CONFIRMED: "Confirmé", DONE: "Terminé", CANCELLED: "Annulé" }[status]}
          </span>
        ))}
      </div>

      {/* Selected date summary */}
      {selectedDate && (
        <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold text-slate-700">
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </p>
          {(byDate.get(selectedDate) ?? []).length === 0 ? (
            <p className="mt-0.5 text-xs text-slate-400">Aucun rendez-vous</p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              {(byDate.get(selectedDate) ?? []).map((a) => (
                <li key={a.id} className="text-xs text-slate-600">
                  {a.slot} · {a.service.nom}
                  {a.gamme && <span className="text-slate-400"> · {a.gamme}</span>}
                  <span className="ml-1 text-slate-400">
                    ({a.client.prenom} {a.client.nom})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
