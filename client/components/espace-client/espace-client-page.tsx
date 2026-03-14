import { AuthGate } from "@/components/espace-client/auth-gate";
import { Dashboard } from "@/components/espace-client/dashboard";
import type { Appointment } from "@/types/appointment";
import type { AuthUser } from "@/types/auth";

type EspaceClientPageProps = {
  appointments: Appointment[];
  authError?: string | null;
  user: AuthUser | null;
};

export function EspaceClientPage({
  appointments,
  authError = null,
  user,
}: EspaceClientPageProps) {
  if (!user) {
    return <AuthGate authError={authError} />;
  }

  return <Dashboard user={user} appointments={appointments} />;
}
