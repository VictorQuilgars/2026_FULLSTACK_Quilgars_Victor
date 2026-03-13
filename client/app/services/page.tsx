import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { ServicesList } from "@/components/marketing/services-list";
import { getServices } from "@/lib/api/services";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <ServicesList services={services} />
      </main>
      <SiteFooter />
    </div>
  );
}

