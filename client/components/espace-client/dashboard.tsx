"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getMyAppointments } from "@/lib/api/appointments";
import type { Appointment } from "@/types/appointment";
import { ProfileSection } from "./profile-section";
import { ReservationsSection } from "./reservations-section";

type DashboardProps = {
  user: User;
  onLogout: () => void;
};

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<
    "reservations" | "profil" | "infos"
  >("reservations");

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        const result = await getMyAppointments(token);
        setAppointments(result);
      }
    };

    void fetchAppointments();
  }, []);

  const tabs = [
    { key: "reservations" as const, label: "Réservations" },
    { key: "profil" as const, label: "Profil" },
    { key: "infos" as const, label: "Informations" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Espace client</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Se déconnecter
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-xl bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "bg-white text-rose-primary shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "reservations" && (
          <ReservationsSection appointments={appointments} />
        )}
        {activeTab === "profil" && <ProfileSection user={user} />}
        {activeTab === "infos" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Informations
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="font-medium text-slate-700">Entreprise</span>
                <span>Roz Nettoyage</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="font-medium text-slate-700">Zone</span>
                <span>Brest et alentours</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="font-medium text-slate-700">Téléphone</span>
                <a
                  href="tel:+33772103552"
                  className="text-rose-primary hover:underline"
                >
                  07 72 10 35 52
                </a>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700">Email</span>
                <a
                  href="mailto:roz.nettoyage@gmail.com"
                  className="text-rose-primary hover:underline"
                >
                  roz.nettoyage@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
