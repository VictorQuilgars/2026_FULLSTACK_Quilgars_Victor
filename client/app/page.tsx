"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  // Champs formulaire
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message ?? "Erreur de connexion.");
        return;
      }

      // Injecter la session Supabase côté client
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    } catch {
      setAuthError("Impossible de contacter le serveur.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nom, prenom }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message ?? "Erreur lors de l'inscription.");
        return;
      }

      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
    } catch {
      setAuthError("Impossible de contacter le serveur.");
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
      <h1>Car Wash App</h1>

      {authError ? (
        <p style={{ color: "#b00020" }}>Erreur: {authError}</p>
      ) : null}

      {user ? (
        <>
          <p>Connecte en tant que: {user.email}</p>
          <button onClick={handleLogout}>Se deconnecter</button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              onClick={() => setMode("login")}
              style={{
                fontWeight: mode === "login" ? "bold" : "normal",
                marginRight: "1rem",
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode("register")}
              style={{ fontWeight: mode === "register" ? "bold" : "normal" }}
            >
              Inscription
            </button>
          </div>

          {mode === "login" ? (
            <form
              onSubmit={handleEmailLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxWidth: 320,
              }}
            >
              <h2>Connexion</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Se connecter</button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                maxWidth: 320,
              }}
            >
              <h2>Inscription</h2>
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe (6 car. min)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="submit">Creer mon compte</button>
            </form>
          )}

          <hr style={{ margin: "1.5rem 0" }} />
          <button onClick={handleGoogleLogin}>Se connecter avec Google</button>
        </>
      )}
    </main>
  );
}
