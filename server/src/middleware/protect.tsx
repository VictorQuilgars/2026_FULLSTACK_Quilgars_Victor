import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { getAuth0UserInfo, verifyAuth0AccessToken } from "../lib/auth0";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

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
        : "";

  const nom =
    typeof profile.family_name === "string" && profile.family_name.trim()
      ? profile.family_name.trim()
      : typeof profile.name === "string" && profile.name.trim()
        ? profile.name.trim().split(" ").slice(1).join(" ").trim() ||
          ""
        : "";

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
    try {
      user = await prisma.user.create({
        data: {
          id: auth0Id,
          email: tokenEmail || null,
          nom: nomCandidate,
          prenom: prenomCandidate,
          password: "AUTH0_MANAGED_ACCOUNT",
          tel: "",
          dateNaissance: null,
          sexe: null,
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
      email?: string | null;
      prenom?: string;
      nom?: string;
    } = {};

    if (tokenEmail && user.email !== tokenEmail) {
      updates.email = tokenEmail;
    }

    if (
      prenomCandidate &&
      (!user.prenom.trim() || user.prenom === "Client")
    ) {
      updates.prenom = prenomCandidate;
    }

    if (
      nomCandidate &&
      (!user.nom.trim() || user.nom === "Auth0")
    ) {
      updates.nom = nomCandidate;
    }

    if (!tokenEmail && user.email?.endsWith("@auth0.local")) {
      updates.email = null;
    }

    if (!prenomCandidate && user.prenom === "Client") {
      updates.prenom = "";
    }

    if (!nomCandidate && user.nom === "Auth0") {
      updates.nom = "";
    }

    if (Object.keys(updates).length > 0) {
      try {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      } catch (updateError) {
        if (
          updateError instanceof Prisma.PrismaClientKnownRequestError &&
          updateError.code === "P2002"
        ) {
          // Concurrent request already applied the update — refetch
          user = await prisma.user.findUnique({ where: { id: user!.id } });
        } else {
          throw updateError;
        }
      }
    }
  }

  if (user?.state === "SUSPENDED") {
    return next(new AppError("Votre compte a été suspendu. Contactez l'administration.", 403));
  }

  req.authUser = user;
  next();
};
