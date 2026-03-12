import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AccessLevel, Gender } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { supabase } from "../lib/supabase";
import { AppError } from "../utils/appError";

type SyncAuthBody = {
  nom?: string;
  prenom?: string;
};

type RegisterBody = {
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

type UpdateProfileBody = {
  nom?: string;
  prenom?: string;
  tel?: string;
  dateNaissance?: string;
  sexe?: string;
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

// ─── Register (email / password) ────────────────────────────────────────────

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
) => {
  const { email, password, nom, prenom } = req.body;

  if (!email || !password || !nom || !prenom) {
    throw new AppError(
      "Les champs email, password, nom et prenom sont obligatoires.",
      400,
    );
  }

  if (password.length < 6) {
    throw new AppError(
      "Le mot de passe doit contenir au moins 6 caracteres.",
      400,
    );
  }

  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: signUpData, error: signUpError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (signUpError) {
    if (signUpError.message.includes("already been registered")) {
      throw new AppError("Un compte avec cet email existe deja.", 409);
    }
    throw new AppError(signUpError.message, 400);
  }

  const supabaseUser = signUpData.user;

  // 2. Hash du mot de passe pour Prisma
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Créer l'utilisateur dans la base Prisma
  const user = await prisma.user.create({
    data: {
      id: supabaseUser.id,
      email,
      nom,
      prenom,
      password: hashedPassword,
      tel: "",
      dateNaissance: new Date("1970-01-01T00:00:00.000Z"),
      sexe: Gender.AUTRE,
      droit: AccessLevel.USER,
    },
  });

  // 4. Connexion immédiate pour retourner le token
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.session) {
    // L'utilisateur est créé mais on n'a pas pu le connecter automatiquement
    return res.status(201).json({
      message: "Compte cree avec succes. Veuillez vous connecter.",
      user,
    });
  }

  res.status(201).json({
    message: "Compte cree et connecte avec succes.",
    user,
    session: {
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      expires_at: signInData.session.expires_at,
    },
  });
};

// ─── Login (email / password) ───────────────────────────────────────────────

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Les champs email et password sont obligatoires.", 400);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError("Email ou mot de passe incorrect.", 401);
  }

  // Récupérer l'utilisateur Prisma pour renvoyer les infos complètes
  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  if (!user) {
    // L'utilisateur existe dans Supabase mais pas encore dans Prisma (cas rare)
    // On le crée à la volée
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email!,
        nom: data.user.user_metadata?.family_name ?? "Utilisateur",
        prenom: data.user.user_metadata?.given_name ?? "",
        password: hashedPassword,
        tel: "",
        dateNaissance: new Date("1970-01-01T00:00:00.000Z"),
        sexe: Gender.AUTRE,
        droit: AccessLevel.USER,
      },
    });

    return res.status(200).json({
      message: "Connexion reussie.",
      user: newUser,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  }

  res.status(200).json({
    message: "Connexion reussie.",
    user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
};

export const updateProfile = async (
  req: Request<unknown, unknown, UpdateProfileBody>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const { nom, prenom, tel, dateNaissance, sexe } = req.body;
  const data: {
    nom?: string;
    prenom?: string;
    tel?: string;
    dateNaissance?: Date;
    sexe?: Gender;
  } = {};

  if (nom !== undefined) {
    const trimmedNom = nom.trim();

    if (!trimmedNom) {
      throw new AppError("Le nom ne peut pas etre vide.", 400);
    }

    data.nom = trimmedNom;
  }

  if (prenom !== undefined) {
    const trimmedPrenom = prenom.trim();

    if (!trimmedPrenom) {
      throw new AppError("Le prenom ne peut pas etre vide.", 400);
    }

    data.prenom = trimmedPrenom;
  }

  if (tel !== undefined) {
    data.tel = tel.trim();
  }

  if (dateNaissance !== undefined) {
    const parsedDate = new Date(dateNaissance);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new AppError(
        "La date de naissance doit respecter un format valide.",
        400,
      );
    }

    data.dateNaissance = parsedDate;
  }

  if (sexe !== undefined) {
    if (!Object.values(Gender).includes(sexe as Gender)) {
      throw new AppError("La valeur du sexe est invalide.", 400);
    }

    data.sexe = sexe as Gender;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("Aucun champ de profil a mettre a jour.", 400);
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

  res.status(200).json({
    message: "Profil mis a jour avec succes.",
    user,
  });
};
