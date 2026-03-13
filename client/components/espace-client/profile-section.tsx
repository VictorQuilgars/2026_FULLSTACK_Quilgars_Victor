import type { User } from "@supabase/supabase-js";

type ProfileSectionProps = {
  user: User;
};

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Email
          </label>
          <p className="mt-1 text-sm text-slate-900">{user.email}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Identifiant
          </label>
          <p className="mt-1 text-sm font-mono text-slate-500 text-xs">
            {user.id}
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Membre depuis
          </label>
          <p className="mt-1 text-sm text-slate-900">
            {new Date(user.created_at).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
