"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

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

  const handleLogin = async () => {
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Erreur de deconnexion:", error.message);
    }
  };

  if (loading) {
    return <main style={{ padding: "2rem" }}>Chargement...</main>;
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Auth Supabase</h1>

      {authError ? (
        <p style={{ color: "#b00020" }}>Erreur auth: {authError}</p>
      ) : null}

      {user ? (
        <>
          <p>Connecte en tant que: {user.email}</p>
          <button onClick={handleLogout}>Se deconnecter</button>
        </>
      ) : (
        <>
          <p>Tu n&apos;es pas connecte.</p>
          <button onClick={handleLogin}>Se connecter avec Google</button>
        </>
      )}
    </main>
  );
}
