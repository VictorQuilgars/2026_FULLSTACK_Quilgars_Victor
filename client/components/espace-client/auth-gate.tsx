import type { AuthMode } from "@/types/auth";

type AuthGateProps = {
  authError: string | null;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  mode: AuthMode;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onNomChange: (v: string) => void;
  onPrenomChange: (v: string) => void;
  onModeChange: (m: AuthMode) => void;
  onGoogleLogin: () => void;
  onLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function AuthGate({
  authError,
  email,
  password,
  nom,
  prenom,
  mode,
  onEmailChange,
  onPasswordChange,
  onNomChange,
  onPrenomChange,
  onModeChange,
  onGoogleLogin,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthGateProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-gradient text-lg font-bold text-white shadow-rose-md">
          RZ
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Espace client
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Connectez-vous ou créez un compte pour accéder à vos réservations.
        </p>
      </div>

      {authError && (
        <div className="mt-6 rounded-xl bg-rose-primary/10 border border-rose-primary/30 px-4 py-3 text-sm text-rose-strong font-medium">
          {authError}
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-rose-primary shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "register"
              ? "bg-white text-rose-primary shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Inscription
        </button>
      </div>

      {mode === "login" ? (
        <form className="mt-6 space-y-4" onSubmit={onLoginSubmit}>
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
              placeholder="contact@exemple.fr"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
              placeholder="Votre mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
          >
            Se connecter
          </button>
        </form>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onRegisterSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="register-nom"
                className="block text-sm font-medium text-slate-700"
              >
                Nom
              </label>
              <input
                id="register-nom"
                type="text"
                value={nom}
                onChange={(e) => onNomChange(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                placeholder="Dupont"
              />
            </div>
            <div>
              <label
                htmlFor="register-prenom"
                className="block text-sm font-medium text-slate-700"
              >
                Prénom
              </label>
              <input
                id="register-prenom"
                type="text"
                value={prenom}
                onChange={(e) => onPrenomChange(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
                placeholder="Alex"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
              placeholder="contact@exemple.fr"
            />
          </div>
          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-slate-700"
            >
              Mot de passe
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-rose-primary focus:outline-none focus:ring-2 focus:ring-rose-primary/20"
              placeholder="6 caractères minimum"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
          >
            Créer mon compte
          </button>
        </form>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
        OU
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="mt-4 w-full rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Continuer avec Google
      </button>
    </div>
  );
}
