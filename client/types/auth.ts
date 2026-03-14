export type AuthUser = {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  droit: "USER" | "ADMIN" | "SUPER_ADMIN";
  role: string | null;
  createdAt: string;
};
