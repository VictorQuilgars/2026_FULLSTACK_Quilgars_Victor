"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types/auth";

type ProfileSectionProps = {
  user: AuthUser;
  onUserUpdated: (user: AuthUser) => void;
};

type ProfileResponse = {
  message?: string;
  user?: AuthUser;
};

const formatDateForInput = (date: string | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const PREDEFINED_ROLES = [
  "Co-fondateur",
  "Technicien",
  "Expert Nettoyage",
  "Spécialiste Intérieur",
  "Responsable Qualité",
];

export function ProfileSection({
  user,
  onUserUpdated,
}: ProfileSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isStaff = user.droit === "ADMIN" || user.droit === "COLLABORATEUR";
  const canEditRole = user.droit === "ADMIN";
  const [form, setForm] = useState({
    prenom: user.prenom,
    nom: user.nom,
    email: user.email ?? "",
    tel: user.tel,
    dateNaissance: formatDateForInput(user.dateNaissance),
    sexe: user.sexe ?? "",
    role: user.role ?? "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const payload = (await response.json()) as ProfileResponse;

        if (!response.ok || !payload.user) {
          setError(payload.message ?? "Impossible de mettre à jour le profil.");
          return;
        }

        onUserUpdated(payload.user);
        setForm({
          prenom: payload.user.prenom,
          nom: payload.user.nom,
          email: payload.user.email ?? "",
          tel: payload.user.tel,
          dateNaissance: formatDateForInput(payload.user.dateNaissance),
          sexe: payload.user.sexe ?? "",
          role: payload.user.role ?? "",
        });
        setMessage(payload.message ?? "Profil mis à jour avec succès.");
        router.refresh();
      } catch {
        setError("Impossible de mettre à jour le profil.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Mon profil</h2>
          <p className="mt-1 text-sm text-slate-500">
            Complétez vos informations si elles n&apos;ont pas été récupérées
            depuis Google/Auth0.
          </p>
        </div>
        <p className="text-xs text-slate-400">
          Membre depuis{" "}
          {new Date(user.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} />
          <Field label="Nom" name="nom" value={form.nom} onChange={handleChange} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="vous@exemple.fr"
          />
          <Field
            label="Téléphone"
            name="tel"
            value={form.tel}
            onChange={handleChange}
            placeholder="06 00 00 00 00"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Date de naissance"
            name="dateNaissance"
            type="date"
            value={form.dateNaissance}
            onChange={handleChange}
          />
          <label className="block">
            <span className="block text-xs font-medium text-slate-500">
              Sexe
            </span>
            <select
              name="sexe"
              value={form.sexe}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-primary"
            >
              <option value="">Non renseigné</option>
              <option value="MASCULIN">Masculin</option>
              <option value="FEMININ">Féminin</option>
              <option value="AUTRE">Autre</option>
            </select>
          </label>
        </div>

        {isStaff && (
          <label className="block">
            <span className="block text-xs font-medium text-slate-500">
              Rôle dans l&apos;équipe
            </span>
            {canEditRole ? (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-primary"
              >
                <option value="">Non renseigné</option>
                {PREDEFINED_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ) : (
              <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                {form.role || "Non renseigné"}
              </p>
            )}
          </label>
        )}

        {error && (
          <div className="rounded-xl border border-rose-primary/30 bg-rose-primary/10 px-4 py-3 text-sm text-rose-strong">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  value: string;
};

function Field({
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-rose-primary"
      />
    </label>
  );
}
