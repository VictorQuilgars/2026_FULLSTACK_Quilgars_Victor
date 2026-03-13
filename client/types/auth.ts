export type AuthMode = "login" | "register";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  nom: string;
  prenom: string;
};

export type AuthSessionPayload = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
};

export type AuthSuccessResponse = {
  message: string;
  session?: AuthSessionPayload;
};

export type AuthErrorResponse = {
  message?: string;
};