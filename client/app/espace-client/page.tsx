import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { EspaceClientPage } from "@/components/espace-client/espace-client-page";

export const metadata = {
  title: "Espace client | Roz Nettoyage",
  description:
    "Accédez à votre espace client Roz Nettoyage : profil, réservations et informations.",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <EspaceClientPage />
      </main>
      <SiteFooter />
    </div>
  );
}
