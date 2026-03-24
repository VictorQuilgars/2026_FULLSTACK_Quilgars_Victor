import type { Request, Response } from "express";
import { AccessLevel } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

export const getStats = async (req: Request, res: Response) => {
  if (req.authUser?.droit !== AccessLevel.ADMIN) {
    throw new AppError("Accès réservé aux administrateurs.", 403);
  }

  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Tous les RDV non annulés
  const allDone = await prisma.appointment.findMany({
    where: { status: "DONE" },
    include: { service: { select: { nom: true } } },
  });

  const allAppointments = await prisma.appointment.findMany({
    select: { status: true, prix: true, date: true, serviceId: true, service: { select: { nom: true } } },
  });

  // ─── Chiffre d'affaires ───────────────────────────────────────────────────
  const caTotal = allDone.reduce((sum, a) => sum + (a.prix ?? 0), 0);

  const caWeek = allDone
    .filter((a) => new Date(a.date) >= startOfWeek)
    .reduce((sum, a) => sum + (a.prix ?? 0), 0);

  const caMonth = allDone
    .filter((a) => new Date(a.date) >= startOfMonth)
    .reduce((sum, a) => sum + (a.prix ?? 0), 0);

  const caYear = allDone
    .filter((a) => new Date(a.date) >= startOfYear)
    .reduce((sum, a) => sum + (a.prix ?? 0), 0);

  // ─── Compteurs par statut ─────────────────────────────────────────────────
  const countByStatus = {
    PENDING: 0, CONFIRMED: 0, DONE: 0, CANCELLED: 0,
  } as Record<string, number>;

  for (const a of allAppointments) {
    countByStatus[a.status] = (countByStatus[a.status] ?? 0) + 1;
  }

  const total = allAppointments.length;
  const cancellationRate = total > 0
    ? Math.round((countByStatus.CANCELLED / total) * 100)
    : 0;

  // ─── Services les plus demandés ───────────────────────────────────────────
  const serviceCount: Record<string, { count: number; revenue: number }> = {};
  for (const a of allAppointments) {
    const nom = a.service.nom;
    if (!serviceCount[nom]) serviceCount[nom] = { count: 0, revenue: 0 };
    serviceCount[nom].count++;
    if (a.status === "DONE") serviceCount[nom].revenue += a.prix ?? 0;
  }

  const topServices = Object.entries(serviceCount)
    .map(([nom, data]) => ({ nom, ...data }))
    .sort((a, b) => b.count - a.count);

  // ─── Évolution mensuelle sur 6 mois ──────────────────────────────────────
  const monthly: { month: string; rdv: number; ca: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

    const appts = allAppointments.filter((a) => {
      const date = new Date(a.date);
      return date >= d && date < end;
    });

    monthly.push({
      month: label,
      rdv: appts.length,
      ca: appts.filter((a) => a.status === "DONE").reduce((s, a) => s + (a.prix ?? 0), 0),
    });
  }

  res.status(200).json({
    ca: { total: caTotal, week: caWeek, month: caMonth, year: caYear },
    appointments: { total, ...countByStatus, cancellationRate },
    topServices,
    monthly,
  });
};
