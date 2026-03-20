import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { EspaceClientPage } from "@/components/espace-client/espace-client-page";
import { auth0 } from "@/lib/auth0";
import type { Appointment } from "@/types/appointment";
import type { AuthUser } from "@/types/auth";
import { API_URL } from "@/lib/config";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Espace client | Roz Nettoyage",
  description:
    "Accédez à votre espace client Roz Nettoyage : profil, réservations et informations.",
};

const fetchWithAuth = async <T,>(
  endpoint: string,
  token: string,
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Erreur API (${response.status}) sur ${endpoint}${errorBody ? `: ${errorBody}` : ""}`,
    );
  }

  return (await response.json()) as T;
};

const getReadableErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return "Erreur inconnue lors de la récupération du token ou des données API.";
};

type MeResponse = { user: AuthUser };

export default async function Page() {
  const session = await auth0.getSession();

  let authError: string | null = null;
  let user: AuthUser | null = null;
  let appointments: Appointment[] = [];

  if (session) {
    try {
      const { token } = await auth0.getAccessToken({ refresh: true });

      const [meResponse, myAppointments] = await Promise.all([
        fetchWithAuth<MeResponse>("/auth/me", token),
        fetchWithAuth<Appointment[]>("/my-appointments", token),
      ]);

      user = meResponse.user;
      appointments = myAppointments;
    } catch (error) {
      const message = getReadableErrorMessage(error);

      console.error("Echec Auth0/API dans espace-client", error);

      if (message.includes("re-authenticate")) {
        redirect("/auth/login?prompt=login&returnTo=/espace-client");
      }

      authError = `Session Auth0 active, mais impossible de récupérer vos données API. ${message}`;
    }
  }

  if (user?.droit === "ADMIN" || user?.droit === "SUPER_ADMIN") {
    redirect("/espace-admin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <EspaceClientPage
          appointments={appointments}
          authError={authError}
          user={user}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
