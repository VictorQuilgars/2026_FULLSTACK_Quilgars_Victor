import type { Request, Response } from "express";
import { AccessLevel } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

type CreateBody = { date?: string; dateFin?: string; slot?: string | null; reason?: string };

// ─── GET /admin/blocked-slots ─────────────────────────────────────────────────
export const getBlockedSlots = async (req: Request, res: Response) => {
  const blocks = await prisma.blockedSlot.findMany({
    orderBy: [{ date: "asc" }, { slot: "asc" }],
  });
  res.status(200).json(blocks);
};

// ─── POST /admin/blocked-slots ────────────────────────────────────────────────
export const createBlockedSlot = async (
  req: Request<object, unknown, CreateBody>,
  res: Response,
) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const { date, dateFin, slot, reason } = req.body;

  if (!date) throw new AppError("Le champ date est obligatoire.", 400);

  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  if (isNaN(start.getTime())) throw new AppError("Date invalide.", 400);

  // Plage de jours (journée entière uniquement)
  const end = dateFin && !slot ? new Date(dateFin) : new Date(date);
  end.setUTCHours(0, 0, 0, 0);
  if (isNaN(end.getTime()) || end < start) {
    throw new AppError("Date de fin invalide.", 400);
  }

  // Générer toutes les dates de la plage
  const dates: Date[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const created: object[] = [];
  const skipped: string[] = [];

  for (const d of dates) {
    try {
      const block = await prisma.blockedSlot.create({
        data: { date: d, slot: slot ?? null, reason: reason ?? null },
      });
      created.push(block);
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2002") {
        skipped.push(d.toISOString().slice(0, 10));
      } else {
        throw error;
      }
    }
  }

  res.status(201).json({ created, skipped });
};

// ─── DELETE /admin/blocked-slots/:id ─────────────────────────────────────────
export const deleteBlockedSlot = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const id = Number(req.params.id);
  const block = await prisma.blockedSlot.findUnique({ where: { id } });

  if (!block) throw new AppError("Bloc introuvable.", 404);

  await prisma.blockedSlot.delete({ where: { id } });
  res.status(200).json({ message: "Bloc supprimé." });
};
