import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { AdminDashboard } from "@/components/espace-admin/admin-dashboard";
import { auth0 } from "@/lib/auth0";
import { API_URL } from "@/lib/config";
import type { AuthUser } from "@/types/auth";
import type { AdminAppointment } from "@/types/admin";

export const metadata = {
  title: "Administration | Roz Nettoyage",
};

export default async function Page() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login?returnTo=/espace-admin");
  }

  const { token } = await auth0.getAccessToken({ refresh: true });

  // Récupérer le profil pour vérifier le rôle
  const meRes = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!meRes.ok) {
    redirect("/auth/login?prompt=login&returnTo=/espace-admin");
  }

  const { user } = (await meRes.json()) as { user: AuthUser };

  // Seuls ADMIN et SUPER_ADMIN ont accès
  if (user.droit === "USER") {
    redirect("/espace-client");
  }

  // Charger les rendez-vous
  const appointmentsRes = await fetch(`${API_URL}/admin/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const appointments: AdminAppointment[] = appointmentsRes.ok
    ? await appointmentsRes.json()
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <AdminDashboard user={user} initialAppointments={appointments} />
      </main>
      <SiteFooter />
    </div>
  );
}
