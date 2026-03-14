type AuthGateProps = {
  authError?: string | null;
};

export function AuthGate({ authError = null }: AuthGateProps) {
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
          Connectez-vous avec Auth0 pour accéder à vos réservations.
        </p>
      </div>

      {authError && (
        <div className="mt-6 rounded-xl border border-rose-primary/30 bg-rose-primary/10 px-4 py-3 text-sm font-medium text-rose-strong">
          {authError}
        </div>
      )}

      <div className="mt-8 grid gap-3">
        <a
          href="/auth/login?returnTo=/espace-client"
          className="inline-flex w-full items-center justify-center rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01]"
        >
          Connexion
        </a>
        <a
          href="/auth/login?screen_hint=signup&returnTo=/espace-client"
          className="inline-flex w-full items-center justify-center rounded-full border border-rose-primary/40 px-6 py-2.5 text-sm font-semibold text-rose-primary transition hover:bg-rose-soft/50"
        >
          Inscription
        </a>
      </div>
    </div>
  );
}
