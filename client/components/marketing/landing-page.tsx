import { Hero } from "@/components/marketing/hero";
import { WhyChooseUs } from "@/components/marketing/why-choose-us";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { AboutSection } from "@/components/marketing/about";
import { ContactCta } from "@/components/marketing/contact-cta";
import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhyChooseUs />
        <ServicesOverview />
        <PricingTeaser />
        <AboutSection />
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  );
}

