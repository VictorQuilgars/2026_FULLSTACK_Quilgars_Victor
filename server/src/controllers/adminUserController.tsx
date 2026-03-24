import type { Request, Response } from "express";
import { AccessLevel, UserState } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

// ─── GET /admin/staff ─────────────────────────────────────────────────────────
export const getStaff = async (req: Request, res: Response) => {
  const staff = await prisma.user.findMany({
    where: { droit: { in: [AccessLevel.ADMIN, AccessLevel.COLLABORATEUR] } },
    select: { id: true, nom: true, prenom: true, role: true, droit: true },
    orderBy: [{ droit: "asc" }, { prenom: "asc" }],
  });
  res.status(200).json(staff);
};

const USER_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  email: true,
  tel: true,
  droit: true,
  role: true,
  state: true,
  createdAt: true,
  _count: { select: { appointments: true, assignedTasks: true } },
};

// ─── GET /admin/users ─────────────────────────────────────────────────────────
export const getUsers = async (req: Request, res: Response) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const users = await prisma.user.findMany({
    select: USER_SELECT,
    orderBy: [{ droit: "asc" }, { nom: "asc" }],
  });

  res.status(200).json(users);
};

// ─── GET /admin/users/:id/appointments ───────────────────────────────────────
export const getUserAppointments = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      OR: [{ clientId: req.params.id }, { staffId: req.params.id }],
    },
    include: {
      service: true,
      client: { select: { id: true, nom: true, prenom: true, email: true } },
      staff: { select: { id: true, nom: true, prenom: true, role: true } },
    },
    orderBy: [{ date: "desc" }, { slot: "asc" }],
  });

  res.status(200).json(appointments);
};

// ─── PATCH /admin/users/:id/state ────────────────────────────────────────────
export const updateUserState = async (
  req: Request<{ id: string }, unknown, { state?: string }>,
  res: Response,
) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const { state } = req.body;

  if (!state || !Object.values(UserState).includes(state as UserState)) {
    throw new AppError("État invalide. Valeurs autorisées : ACTIVE, SUSPENDED.", 400);
  }

  // Un admin ne peut pas se suspendre lui-même
  if (req.params.id === req.authUser.id) {
    throw new AppError("Vous ne pouvez pas modifier votre propre état.", 403);
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { state: state as UserState },
    select: USER_SELECT,
  });

  res.status(200).json(user);
};

// ─── DELETE /admin/users/:id ──────────────────────────────────────────────────
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  if (req.params.id === req.authUser.id) {
    throw new AppError("Vous ne pouvez pas supprimer votre propre compte.", 403);
  }

  await prisma.user.delete({ where: { id: req.params.id } });

  res.status(200).json({ message: "Utilisateur supprimé." });
};
