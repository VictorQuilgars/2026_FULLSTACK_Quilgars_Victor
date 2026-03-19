import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Roz Nettoyage | Nettoyage voiture, canapé & textile",
  description:
    "Roz Nettoyage : nettoyage intérieur voiture, canapé, fauteuil, tapis et matelas à Brest et alentours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${outfit.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
