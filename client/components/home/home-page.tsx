"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  heroContent,
  reassuranceItems,
  serviceCards,
} from "@/constants/site-content";
import { loginWithPassword, registerWithPassword } from "@/lib/api/auth";
import { supabase } from "@/lib/supabase";
import type { AuthMode } from "@/types/auth";
import { AuthPanel } from "./auth-panel";

export function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  useEffect(() => {
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur de session:", error.message);
      }

      setUser(data.user ?? null);
      setLoading(false);
    };

    void getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const applySession = async (session?: {
    access_token: string;
    refresh_token: string;
  }) => {
    if (!session) {
      return;
    }

    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthError(error.message);
      console.error("Erreur de connexion:", error.message);
    }
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    try {
      const data = await loginWithPassword({ email, password });
      await applySession(data.session);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Erreur lors de la connexion.",
      );
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    try {
      const data = await registerWithPassword({ email, password, nom, prenom });
      await applySession(data.session);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'inscription.",
      );
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur de deconnexion:", error.message);
    }
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setAuthError(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="min-h-screen grid place-items-center text-muted text-base">
          Chargement...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-primary/8">
        <div className="w-[min(1280px,calc(100%-32px))] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[12px] bg-rose-gradient text-white grid place-items-center font-black text-lg">
              R
            </div>
            <div>
              <div className="font-bold text-ink">Roz Nettoyage</div>
              <div className="text-xs text-muted">Nettoyage automobile</div>
            </div>
          </div>
          {user && <div className="text-sm text-muted">{user.email}</div>}
        </div>
      </header>

      {/* Main content */}
      <div className="w-full">
        {/* Hero Section - Full width with gradient */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-rose-primary/12 via-white to-white">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-rose-primary/8 blur-3xl" />
            <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-rose-strong/5 blur-3xl" />
          </div>

          <div className="relative z-10 w-[min(1280px,calc(100%-32px))] mx-auto px-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-rose-primary/10 border border-rose-primary/20">
                <span className="w-2 h-2 rounded-full bg-rose-primary" />
                <span className="text-sm font-semibold text-rose-primary">
                  {heroContent.badge}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-ink">
                {heroContent.title}
              </h1>

              <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl">
                {heroContent.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleModeChange("register")}
                  type="button"
                  className="px-8 py-4 rounded-full font-black text-white bg-rose-gradient shadow-rose-lg hover:shadow-rose-lg hover:scale-105 transition-all duration-200"
                >
                  Créer un compte
                </button>
                <button
                  onClick={() => handleModeChange("login")}
                  type="button"
                  className="px-8 py-4 rounded-full font-black text-rose-primary bg-rose-primary/8 border-2 border-rose-primary/30 hover:bg-rose-primary/12 transition-all duration-200"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content section with auth sidebar */}
        <div className="relative">
          <div className="w-[min(1280px,calc(100%-32px))] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About section */}
              <section>
                <h2 className="text-3xl font-black text-ink mb-6">
                  Pourquoi Roz Nettoyage ?
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-muted leading-relaxed">
                    Roz Nettoyage c&apos;est le choix des clients exigeants qui
                    veulent un nettoyage professionnel, rapide et transparent.
                  </p>
                  <p className="text-lg text-muted leading-relaxed">
                    Nous utilisons les meilleures techniques et produits pour
                    redonner à votre véhicule toute son éclat.
                  </p>
                </div>
              </section>

              {/* Avantages */}
              <section>
                <h2 className="text-3xl font-black text-ink mb-8">
                  Nos avantages
                </h2>
                <div className="space-y-4">
                  {reassuranceItems.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 pb-4 border-b border-rose-primary/10"
                    >
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-rose-primary" />
                      <span className="text-lg text-ink font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-3xl font-black text-ink mb-8">
                  Nos services
                </h2>
                <div className="space-y-4">
                  {serviceCards.map((service) => (
                    <div
                      key={service.title}
                      className="bg-gradient-to-r from-rose-primary/8 to-rose-strong/5 p-6 rounded-2xl border border-rose-primary/12"
                    >
                      <h3 className="text-xl font-black text-ink mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right sidebar - Auth Panel */}
            <div className="lg:sticky lg:top-20">
              <AuthPanel
                authError={authError}
                email={email}
                password={password}
                nom={nom}
                prenom={prenom}
                mode={mode}
                userEmail={user?.email ?? null}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNomChange={setNom}
                onPrenomChange={setPrenom}
                onModeChange={handleModeChange}
                onGoogleLogin={handleGoogleLogin}
                onLogout={handleLogout}
                onLoginSubmit={handleEmailLogin}
                onRegisterSubmit={handleRegister}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
