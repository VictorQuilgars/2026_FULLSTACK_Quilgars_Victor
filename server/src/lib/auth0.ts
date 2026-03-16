import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { AppError } from "../utils/appError";

type Auth0Config = {
  audience: string;
  issuer: string;
  jwks: ReturnType<typeof createRemoteJWKSet>;
};

export type Auth0AccessTokenClaims = JWTPayload & {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
};

export type Auth0UserInfo = {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
};

let cachedConfig: Auth0Config | null = null;

const getAuth0Config = (): Auth0Config => {
  if (cachedConfig) {
    return cachedConfig;
  }

  const domain = process.env.AUTH0_DOMAIN?.trim();
  const audience = process.env.AUTH0_AUDIENCE?.trim();

  if (!domain || !audience) {
    throw new AppError(
      "Configuration Auth0 manquante (AUTH0_DOMAIN / AUTH0_AUDIENCE).",
      500,
    );
  }

  const baseDomain = domain.startsWith("http") ? domain : `https://${domain}`;
  const issuer = `${baseDomain.replace(/\/+$/, "")}/`;

  cachedConfig = {
    audience,
    issuer,
    jwks: createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`)),
  };

  return cachedConfig;
};

export const verifyAuth0AccessToken = async (
  token: string,
): Promise<Auth0AccessTokenClaims> => {
  const { audience, issuer, jwks } = getAuth0Config();

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience,
    });

    if (typeof payload.sub !== "string" || payload.sub.trim() === "") {
      throw new AppError("Token d'authentification invalide.", 401);
    }

    return payload as Auth0AccessTokenClaims;
  } catch {
    throw new AppError("Token Auth0 invalide ou expiré.", 401);
  }
};

export const getAuth0UserInfo = async (
  token: string,
): Promise<Auth0UserInfo | null> => {
  const { issuer } = getAuth0Config();

  const response = await fetch(new URL("userinfo", issuer), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Partial<Auth0UserInfo>;

  if (typeof data.sub !== "string" || data.sub.trim() === "") {
    return null;
  }

  return {
    sub: data.sub,
    email: typeof data.email === "string" ? data.email : undefined,
    given_name:
      typeof data.given_name === "string" ? data.given_name : undefined,
    family_name:
      typeof data.family_name === "string" ? data.family_name : undefined,
    name: typeof data.name === "string" ? data.name : undefined,
  };
};
