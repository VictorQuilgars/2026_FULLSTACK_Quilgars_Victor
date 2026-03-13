import { API_URL } from "@/lib/config";
import type {
  AuthErrorResponse,
  AuthSuccessResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

const postJson = async <TPayload>(
  endpoint: string,
  payload: TPayload,
): Promise<AuthSuccessResponse> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as AuthSuccessResponse | AuthErrorResponse;

  if (!response.ok) {
    throw new Error(data.message ?? "Une erreur est survenue.");
  }

  return data as AuthSuccessResponse;
};

export const loginWithPassword = (payload: LoginPayload) => {
  return postJson("/auth/login", payload);
};

export const registerWithPassword = (payload: RegisterPayload) => {
  return postJson("/auth/register", payload);
};