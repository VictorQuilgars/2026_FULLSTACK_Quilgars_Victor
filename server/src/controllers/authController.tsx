import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AccessLevel, Gender } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

type SyncAuthBody = {
  nom?: string;
  prenom?: string;
};

export const syncAuthUser = async (
  req: Request<unknown, unknown, SyncAuthBody>,
  res: Response,
) => {
  if (!req.authUser?.id || !req.authUser.email) {
    throw new AppError(
      "Utilisateur Supabase introuvable dans la requete.",
      401,
    );
  }

  const metadata = req.authUser.user_metadata ?? {};
  const nom =
    req.body.nom ??
    metadata.family_name ??
    metadata.last_name ??
    metadata.name ??
    "Utilisateur";

  const prenom =
    req.body.prenom ??
    metadata.given_name ??
    metadata.first_name ??
    metadata.full_name ??
    "Supabase";

  const password = await bcrypt.hash(`oauth:${req.authUser.id}`, 10);

  const user = await prisma.user.upsert({
    where: { id: req.authUser.id },
    update: {
      email: req.authUser.email,
      nom,
      prenom,
    },
    create: {
      id: req.authUser.id,
      email: req.authUser.email,
      nom,
      prenom,
      password,
      tel: "",
      dateNaissance: new Date("1970-01-01T00:00:00.000Z"),
      sexe: Gender.AUTRE,
      droit: AccessLevel.USER,
    },
  });

  res.status(200).json({
    message: "Utilisateur synchronise avec succes.",
    user,
  });
};
