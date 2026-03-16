import type { Request, Response } from "express";
import { Gender } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

type UpdateProfileBody = {
  email?: string;
  nom?: string;
  prenom?: string;
  tel?: string;
  dateNaissance?: string;
  sexe?: string;
};

export const register = async (_req: Request, _res: Response) => {
  throw new AppError(
    "Inscription locale désactivée. Utilisez Auth0 via /auth/login?screen_hint=signup.",
    410,
  );
};

export const login = async (_req: Request, _res: Response) => {
  throw new AppError(
    "Connexion locale désactivée. Utilisez Auth0 via /auth/login.",
    410,
  );
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifié.", 401);
  }

  const { password: _password, ...safeUser } = req.authUser;
  res.status(200).json({ user: safeUser });
};

// ─── Update Profile ──────────────────────────────────────────────────────────

export const updateProfile = async (
  req: Request<unknown, unknown, UpdateProfileBody>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifié.", 401);
  }

  const { email, nom, prenom, tel, dateNaissance, sexe } = req.body;
  const data: {
    email?: string | null;
    nom?: string;
    prenom?: string;
    tel?: string;
    dateNaissance?: Date | null;
    sexe?: Gender | null;
  } = {};

  if (email !== undefined) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      data.email = null;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        throw new AppError("Format d'email invalide.", 400);
      }
      data.email = trimmedEmail;
    }
  }

  if (nom !== undefined) {
    const trimmedNom = nom.trim();
    if (!trimmedNom) throw new AppError("Le nom ne peut pas être vide.", 400);
    data.nom = trimmedNom;
  }

  if (prenom !== undefined) {
    const trimmedPrenom = prenom.trim();
    if (!trimmedPrenom)
      throw new AppError("Le prénom ne peut pas être vide.", 400);
    data.prenom = trimmedPrenom;
  }

  if (tel !== undefined) data.tel = tel.trim();

  if (dateNaissance !== undefined) {
    if (!dateNaissance.trim()) {
      data.dateNaissance = null;
    } else {
      const parsedDate = new Date(dateNaissance);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new AppError("Format de date invalide.", 400);
      }
      data.dateNaissance = parsedDate;
    }
  }

  if (sexe !== undefined) {
    if (!sexe.trim()) {
      data.sexe = null;
    } else {
      if (!Object.values(Gender).includes(sexe as Gender)) {
        throw new AppError("Valeur de sexe invalide.", 400);
      }
      data.sexe = sexe as Gender;
    }
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Aucun champ à mettre à jour.", 400);
  }

  const user = await prisma.user.update({
    where: { id: req.authUser.id },
    data,
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      tel: true,
      dateNaissance: true,
      sexe: true,
      droit: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ message: "Profil mis à jour avec succès.", user });
};
