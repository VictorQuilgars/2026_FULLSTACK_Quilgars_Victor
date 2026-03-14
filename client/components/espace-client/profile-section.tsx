import type { AuthUser } from "@/types/auth";

type ProfileSectionProps = {
  user: AuthUser;
};

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Prénom
          </label>
          <p className="mt-1 text-sm text-slate-900">{user.prenom}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Nom
          </label>
          <p className="mt-1 text-sm text-slate-900">{user.nom}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Email
          </label>
          <p className="mt-1 text-sm text-slate-900">{user.email}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">
            Membre depuis
          </label>
          <p className="mt-1 text-sm text-slate-900">
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
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
