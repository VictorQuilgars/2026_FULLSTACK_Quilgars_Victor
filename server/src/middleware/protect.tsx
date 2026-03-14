import type { NextFunction, Request, Response } from "express";
import { Gender } from "@prisma/client";
import { verifyAuth0AccessToken } from "../lib/auth0";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

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

  const auth0Id = payload.sub;
  const tokenEmail =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  let user = await prisma.user.findUnique({ where: { id: auth0Id } });

  if (!user && tokenEmail) {
    user = await prisma.user.findUnique({ where: { email: tokenEmail } });
  }

  if (!user) {
    const prenomCandidate =
      typeof payload.given_name === "string" && payload.given_name.trim()
        ? payload.given_name.trim()
        : typeof payload.name === "string" && payload.name.trim()
          ? payload.name.trim().split(" ")[0]
          : "Client";

    const nomCandidate =
      typeof payload.family_name === "string" && payload.family_name.trim()
        ? payload.family_name.trim()
        : typeof payload.name === "string" && payload.name.trim()
          ? payload.name.trim().split(" ").slice(1).join(" ").trim() || "Auth0"
          : "Auth0";

    const email =
      tokenEmail || `${encodeURIComponent(auth0Id).replace(/%/g, "")}@auth0.local`;

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
  }

  req.authUser = user;
  next();
};
