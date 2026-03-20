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
  state: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
};
