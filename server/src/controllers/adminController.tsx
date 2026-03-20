import type { Request, Response } from "express";
import { AccessLevel, AppointmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";

const STAFF_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  role: true,
  email: true,
};

const CLIENT_SELECT = {
  id: true,
  nom: true,
  prenom: true,
  email: true,
  tel: true,
};

const APPOINTMENT_INCLUDE = {
  service: true,
  review: true,
  staff: { select: STAFF_SELECT },
  client: { select: CLIENT_SELECT },
};

// ─── GET /admin/appointments ──────────────────────────────────────────────────
// ADMIN  → ses propres rendez-vous assignés
// SUPER_ADMIN → tous les rendez-vous

export const getAdminAppointments = async (req: Request, res: Response) => {
  if (!req.authUser?.id) throw new AppError("Non authentifié.", 401);

  const isSuperAdmin = req.authUser.droit === AccessLevel.ADMIN;

  const appointments = await prisma.appointment.findMany({
    where: isSuperAdmin ? {} : { staffId: req.authUser.id },
    include: APPOINTMENT_INCLUDE,
    orderBy: [{ date: "asc" }, { slot: "asc" }],
  });

  res.status(200).json(appointments);
};

// ─── PATCH /admin/appointments/:id/status ────────────────────────────────────
// Transitions autorisées :
//   PENDING  → CONFIRMED  (valider)
//   PENDING  → CANCELLED  (refuser)
//   CONFIRMED → DONE      (terminer)
//   CONFIRMED → CANCELLED (annuler)

type UpdateStatusBody = { status?: string };

export const updateAppointmentStatus = async (
  req: Request<{ id: string }, unknown, UpdateStatusBody>,
  res: Response,
) => {
  if (!req.authUser?.id) throw new AppError("Non authentifié.", 401);

  const { status } = req.body;

  const ALLOWED: AppointmentStatus[] = [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.DONE,
    AppointmentStatus.CANCELLED,
  ];

  if (!status || !ALLOWED.includes(status as AppointmentStatus)) {
    throw new AppError(
      `Statut invalide. Valeurs autorisées : ${ALLOWED.join(", ")}.`,
      400,
    );
  }

  const newStatus = status as AppointmentStatus;
  const appointmentId = Number(req.params.id);
  const isSuperAdmin = req.authUser.droit === AccessLevel.ADMIN;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new AppError("Rendez-vous introuvable.", 404);

  // ADMIN ne peut gérer que ses propres rendez-vous assignés
  if (!isSuperAdmin && appointment.staffId !== req.authUser.id) {
    throw new AppError("Vous n'êtes pas assigné à ce rendez-vous.", 403);
  }

  // Vérification des transitions autorisées
  const validTransitions: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CONFIRMED]: [AppointmentStatus.DONE, AppointmentStatus.CANCELLED],
  };

  const allowed = validTransitions[appointment.status] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      `Transition ${appointment.status} → ${newStatus} non autorisée.`,
      400,
    );
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: newStatus },
    include: APPOINTMENT_INCLUDE,
  });

  res.status(200).json(updated);
};
