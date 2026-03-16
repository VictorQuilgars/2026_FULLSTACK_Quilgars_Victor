import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { BookingForm } from "@/components/espace-client/booking-form";
import { auth0 } from "@/lib/auth0";
import { AuthGate } from "@/components/espace-client/auth-gate";
import { getServices } from "@/lib/api/services";

export const metadata = {
  title: "Réserver | Roz Nettoyage",
  description:
    "Réservez votre prestation de nettoyage Roz Nettoyage en quelques clics.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const session = await auth0.getSession();
  const params = await searchParams;

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">
          <AuthGate />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const services = await getServices();
  const preselectedServiceId = params.serviceId
    ? Number(params.serviceId)
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <BookingForm
          services={services}
          preselectedServiceId={preselectedServiceId}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
