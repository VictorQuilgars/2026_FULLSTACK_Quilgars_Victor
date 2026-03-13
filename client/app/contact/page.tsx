import { SiteHeader } from "@/components/marketing/layout/header";
import { SiteFooter } from "@/components/marketing/layout/footer";
import { ContactForm } from "@/components/marketing/contact-form";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}

