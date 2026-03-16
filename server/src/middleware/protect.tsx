import type { NextFunction, Request, Response } from "express";
import { Gender, Prisma } from "@prisma/client";
import { getAuth0UserInfo, verifyAuth0AccessToken } from "../lib/auth0";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

const DEFAULT_AUTH0_PRENOM = "Client";
const DEFAULT_AUTH0_NOM = "Auth0";

const buildIdentityCandidates = (profile: {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}) => {
  const email =
    typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "";

  const prenom =
    typeof profile.given_name === "string" && profile.given_name.trim()
      ? profile.given_name.trim()
      : typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim().split(" ")[0]
        : DEFAULT_AUTH0_PRENOM;

  const nom =
    typeof profile.family_name === "string" && profile.family_name.trim()
      ? profile.family_name.trim()
      : typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim().split(" ").slice(1).join(" ").trim() ||
          DEFAULT_AUTH0_NOM
        : DEFAULT_AUTH0_NOM;

  return { email, prenom, nom };
};

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Token d'authentification manquant.", 401));
  }

  const token = authorization.replace("Bearer ", "").trim();

  let payload;
  try {
    payload = await verifyAuth0AccessToken(token);
  } catch {
    return next(new AppError("Token invalide ou expiré.", 401));
  }

  let userInfo = null;
  try {
    userInfo = await getAuth0UserInfo(token);
  } catch {
    userInfo = null;
  }

  const auth0Id = payload.sub;
  const auth0Profile = {
    email: userInfo?.email ?? payload.email,
    given_name: userInfo?.given_name ?? payload.given_name,
    family_name: userInfo?.family_name ?? payload.family_name,
    name: userInfo?.name ?? payload.name,
  };
  const {
    email: tokenEmail,
    prenom: prenomCandidate,
    nom: nomCandidate,
  } = buildIdentityCandidates(auth0Profile);

  let user = await prisma.user.findUnique({ where: { id: auth0Id } });

  if (!user && tokenEmail) {
    user = await prisma.user.findFirst({
      where: {
        email: {
          equals: tokenEmail,
          mode: "insensitive",
        },
      },
    });
  }

  if (!user) {
    const email =
      tokenEmail || `${encodeURIComponent(auth0Id).replace(/%/g, "")}@auth0.local`;

    try {
      user = await prisma.user.create({
        data: {
          id: auth0Id,
          email,
          nom: nomCandidate,
          prenom: prenomCandidate,
          password: "AUTH0_MANAGED_ACCOUNT",
          tel: "",
          dateNaissance: new Date("1970-01-01T00:00:00.000Z"),
          sexe: Gender.AUTRE,
        },
      });
    } catch (error) {
      // Several requests can hit /auth/me at the same time right after Auth0 login.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        user =
          (await prisma.user.findUnique({ where: { id: auth0Id } })) ??
          (tokenEmail
            ? await prisma.user.findFirst({
                where: {
                  email: {
                    equals: tokenEmail,
                    mode: "insensitive",
                  },
                },
              })
            : null);
      }

      if (!user) {
        throw error;
      }
    }
  }

  if (user) {
    const updates: {
      email?: string;
      prenom?: string;
      nom?: string;
    } = {};

    if (
      tokenEmail &&
      user.email.endsWith("@auth0.local") &&
      user.email !== tokenEmail
    ) {
      updates.email = tokenEmail;
    }

    if (
      prenomCandidate !== DEFAULT_AUTH0_PRENOM &&
      (!user.prenom.trim() || user.prenom === DEFAULT_AUTH0_PRENOM)
    ) {
      updates.prenom = prenomCandidate;
    }

    if (
      nomCandidate !== DEFAULT_AUTH0_NOM &&
      (!user.nom.trim() || user.nom === DEFAULT_AUTH0_NOM)
    ) {
      updates.nom = nomCandidate;
    }

    if (Object.keys(updates).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });
    }
  }

  req.authUser = user;
  next();
};
