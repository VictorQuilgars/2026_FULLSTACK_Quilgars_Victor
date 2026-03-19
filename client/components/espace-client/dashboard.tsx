"use client";

import { useState } from "react";
import Link from "next/link";
import type { AuthUser } from "@/types/auth";
import type { Appointment } from "@/types/appointment";
import { ProfileSection } from "./profile-section";
import { ReservationsSection } from "./reservations-section";

type DashboardProps = {
  user: AuthUser;
  appointments: Appointment[];
  logoutUrl?: string;
};

export function Dashboard({
  user,
  appointments,
  logoutUrl = "/auth/logout",
}: DashboardProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState<"reservations" | "profil">(
    "reservations",
  );

  const identityLine = [currentUser.prenom, currentUser.nom]
    .filter((value) => value.trim())
    .join(" ");
  const secondaryIdentity = currentUser.email ?? "Email non renseigne";

  const tabs = [
    { key: "reservations" as const, label: "Réservations" },
    { key: "profil" as const, label: "Profil" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Espace client</h1>
          <p className="text-sm text-slate-500">
            {identityLine || "Profil incomplet"} · {secondaryIdentity}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/espace-client/reserver"
            className="rounded-full bg-rose-gradient px-4 py-2 text-xs font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
          >
            Nouvelle réservation
          </Link>
          <a
            href={logoutUrl}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Se déconnecter
          </a>
        </div>
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
        {activeTab === "profil" && (
          <ProfileSection
            user={currentUser}
            onUserUpdated={setCurrentUser}
          />
        )}
      </div>
    </div>
  );
}
