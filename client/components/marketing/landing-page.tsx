import { Hero } from "@/components/marketing/hero";
import { WhyChooseUs } from "@/components/marketing/why-choose-us";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { BeforeAfter } from "@/components/marketing/before-after";
import { Testimonials } from "@/components/marketing/testimonials";
import { AboutSection } from "@/components/marketing/about";
import { ContactCta } from "@/components/marketing/contact-cta";

export function LandingPage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <BeforeAfter />
      <WhyChooseUs />
      <Testimonials />
      <AboutSection />
      <ContactCta />
    </>
  );
}
