export type AuthUser = {
  id: string;
  email: string | null;
  nom: string;
  prenom: string;
  tel: string;
  dateNaissance: string | null;
  sexe: "MASCULIN" | "FEMININ" | "AUTRE" | null;
  droit: "USER" | "COLLABORATEUR" | "ADMIN";
  role: string | null;
  createdAt: string;
  updatedAt: string;
};
