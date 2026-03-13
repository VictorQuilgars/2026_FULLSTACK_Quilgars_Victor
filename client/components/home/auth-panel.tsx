import type { AuthMode } from "@/types/auth";

type AuthPanelProps = {
  authError: string | null;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  mode: AuthMode;
  userEmail: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNomChange: (value: string) => void;
  onPrenomChange: (value: string) => void;
  onModeChange: (mode: AuthMode) => void;
  onGoogleLogin: () => void;
  onLogout: () => void;
  onLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AuthPanel({
  authError,
  email,
  password,
  nom,
  prenom,
  mode,
  userEmail,
  onEmailChange,
  onPasswordChange,
  onNomChange,
  onPrenomChange,
  onModeChange,
  onGoogleLogin,
  onLogout,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthPanelProps) {
  return (
    <aside className="w-full bg-gradient-to-br from-rose-primary/10 via-white to-rose-soft/30 rounded-3xl border border-rose-primary/20 p-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-rose-primary mb-2">
            Réservation rapide
          </p>
          <h2 className="text-2xl font-black text-ink leading-tight">
            Connecte-toi ou crée ton compte
          </h2>
        </div>

        {authError && (
          <div className="bg-rose-primary/10 border border-rose-primary/30 rounded-2xl px-4 py-3 text-rose-strong font-medium text-sm">
            {authError}
          </div>
        )}

        {userEmail ? (
          <div className="space-y-4">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-primary/10 px-4 py-3">
              <p className="text-xs text-muted font-semibold uppercase mb-1">
                Connecté en tant que
              </p>
              <p className="text-ink font-semibold">{userEmail}</p>
            </div>
            <button
              className="w-full px-6 py-3 rounded-full font-black text-rose-primary bg-rose-primary/8 border-2 border-rose-primary/20 hover:bg-rose-primary/12 transition-all duration-200"
              onClick={onLogout}
              type="button"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            {/* Tab buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`py-3 rounded-2xl font-black transition-all duration-200 ${
                  mode === "login"
                    ? "bg-rose-gradient text-white shadow-rose-md"
                    : "bg-white/50 text-ink border border-rose-primary/20 hover:bg-white/70"
                }`}
                onClick={() => onModeChange("login")}
                type="button"
              >
                Connexion
              </button>
              <button
                className={`py-3 rounded-2xl font-black transition-all duration-200 ${
                  mode === "register"
                    ? "bg-rose-gradient text-white shadow-rose-md"
                    : "bg-white/50 text-ink border border-rose-primary/20 hover:bg-white/70"
                }`}
                onClick={() => onModeChange("register")}
                type="button"
              >
                Inscription
              </button>
            </div>

            {mode === "login" ? (
              <form className="space-y-4" onSubmit={onLoginSubmit}>
                <div>
                  <label
                    className="text-sm font-black text-ink block mb-2"
                    htmlFor="login-email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                    id="login-email"
                    type="email"
                    placeholder="contact@exemple.fr"
                    value={email}
                    onChange={(event) => onEmailChange(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-black text-ink block mb-2"
                    htmlFor="login-password"
                  >
                    Mot de passe
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                    id="login-password"
                    type="password"
                    placeholder="Ton mot de passe"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    required
                  />
                </div>
                <button
                  className="w-full px-6 py-3 rounded-full font-black text-white bg-rose-gradient shadow-rose-lg hover:scale-105 transition-all duration-200"
                  type="submit"
                >
                  Se connecter
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={onRegisterSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-sm font-black text-ink block mb-2"
                      htmlFor="register-nom"
                    >
                      Nom
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                      id="register-nom"
                      type="text"
                      placeholder="Dupont"
                      value={nom}
                      onChange={(event) => onNomChange(event.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-black text-ink block mb-2"
                      htmlFor="register-prenom"
                    >
                      Prénom
                    </label>
                    <input
                      className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                      id="register-prenom"
                      type="text"
                      placeholder="Alex"
                      value={prenom}
                      onChange={(event) => onPrenomChange(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-black text-ink block mb-2"
                    htmlFor="register-email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                    id="register-email"
                    type="email"
                    placeholder="contact@exemple.fr"
                    value={email}
                    onChange={(event) => onEmailChange(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-black text-ink block mb-2"
                    htmlFor="register-password"
                  >
                    Mot de passe
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl border border-rose-primary/20 bg-white/70 text-ink placeholder-muted focus:border-rose-primary/50 focus:outline-none focus:ring-4 focus:ring-rose-primary/10 transition-all"
                    id="register-password"
                    type="password"
                    placeholder="6 caractères minimum"
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Les autres informations du profil pourront être complétées une
                  fois connecté.
                </p>
                <button
                  className="w-full px-6 py-3 rounded-full font-black text-white bg-rose-gradient shadow-rose-lg hover:scale-105 transition-all duration-200"
                  type="submit"
                >
                  Créer mon compte
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 text-xs text-muted font-semibold before:content-[''] before:flex-1 before:h-px before:bg-rose-primary/15 after:content-[''] after:flex-1 after:h-px after:bg-rose-primary/15">
              OU
            </div>

            <button
              className="w-full px-6 py-3 rounded-full font-black text-ink bg-white/70 border-2 border-rose-primary/20 hover:bg-white transition-all duration-200"
              onClick={onGoogleLogin}
              type="button"
            >
              Continuer avec Google
            </button>
          </>
        )}

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-rose-primary/10 px-4 py-3 text-sm">
          <p className="text-xs font-black uppercase text-rose-primary mb-1">
            💡 Information
          </p>
          <p className="text-muted leading-relaxed">
            Les emplacements image sont prêts pour tes visuels. Tu pourras les
            ajouter une fois connecté.
          </p>
        </div>
      </div>
    </aside>
  );
}
