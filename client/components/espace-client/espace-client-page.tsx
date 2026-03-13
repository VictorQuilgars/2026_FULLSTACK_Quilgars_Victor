"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AuthMode } from "@/types/auth";
import { loginWithPassword, registerWithPassword } from "@/lib/api/auth";
import { AuthGate } from "@/components/espace-client/auth-gate";
import { Dashboard } from "@/components/espace-client/dashboard";

export function EspaceClientPage() {
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
    if (!session) return;
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/espace-client" },
    });
    if (error) {
      setAuthError(error.message);
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Chargement...
      </div>
    );
  }

  if (!user) {
    return (
      <AuthGate
        authError={authError}
        email={email}
        password={password}
        nom={nom}
        prenom={prenom}
        mode={mode}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onNomChange={setNom}
        onPrenomChange={setPrenom}
        onModeChange={(m) => {
          setMode(m);
          setAuthError(null);
        }}
        onGoogleLogin={handleGoogleLogin}
        onLoginSubmit={handleEmailLogin}
        onRegisterSubmit={handleRegister}
      />
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
