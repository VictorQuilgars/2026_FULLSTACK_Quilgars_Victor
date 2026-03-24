import type { Request, Response } from "express";
import { AccessLevel, AppointmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import {
  addMinutes,
  buildDateTimeFromSlot,
  getAppointmentDate,
  parseSlotToMinutes,
  slotsOverlap,
} from "../utils/dateTime";

type CreateAppointmentBody = {
  date?: string;
  slot?: string;
  serviceId?: number;
  gamme?: string;
};

const LAST_ALLOWED_SLOT_MINUTES = 17 * 60;

export const createAppointment = async (
  req: Request<unknown, unknown, CreateAppointmentBody>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const { date, slot, serviceId, gamme } = req.body;

  if (!date || !slot || !serviceId) {
    throw new AppError(
      "Les champs date, slot et serviceId sont obligatoires.",
      400,
    );
  }

  const slotMinutes = parseSlotToMinutes(slot);

  if (slotMinutes > LAST_ALLOWED_SLOT_MINUTES) {
    throw new AppError("Le dernier creneau de debut autorise est 17:00.", 400);
  }

  const appointmentDate = getAppointmentDate(date);

  const service = await prisma.service.findUnique({
    where: { id: Number(serviceId) },
  });

  if (!service) {
    throw new AppError("Service introuvable.", 404);
  }

  const prices = service.prices as Record<string, number>;
  const priceKeys = Object.keys(prices);

  // Si le service a plusieurs gammes, gamme est obligatoire
  let prix: number | undefined;

  if (priceKeys.length > 1) {
    if (!gamme) {
      throw new AppError(
        `Ce service necessite le choix d'une gamme. Gammes disponibles : ${priceKeys.join(", ")}.`,
        400,
      );
    }

    if (!(gamme in prices)) {
      throw new AppError(
        `Gamme "${gamme}" invalide. Gammes disponibles : ${priceKeys.join(", ")}.`,
        400,
      );
    }

    prix = prices[gamme];
  } else {
    // Service à prix unique : on prend automatiquement la seule gamme
    prix = prices[priceKeys[0]];
  }

  const requestedStart = buildDateTimeFromSlot(appointmentDate, slot);
  const requestedEnd = addMinutes(requestedStart, service.dureeMinutes);

  const staffMembers = await prisma.user.findMany({
    where: {
      droit: {
        in: [AccessLevel.COLLABORATEUR, AccessLevel.ADMIN],
      },
    },
    include: {
      assignedTasks: {
        where: {
          date: appointmentDate,
          status: {
            not: AppointmentStatus.CANCELLED,
          },
        },
        include: {
          service: {
            select: {
              dureeMinutes: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        droit: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const availableStaff = staffMembers.find((staffMember) => {
    return staffMember.assignedTasks.every((task) => {
      const existingStart = buildDateTimeFromSlot(task.date, task.slot);
      const existingEnd = addMinutes(existingStart, task.service.dureeMinutes);

      return !slotsOverlap(
        requestedStart,
        requestedEnd,
        existingStart,
        existingEnd,
      );
    });
  });

  if (!availableStaff) {
    throw new AppError(
      "Aucun membre du staff n'est disponible sur ce creneau pour la duree du service.",
      409,
    );
  }

  const appointment = await prisma.appointment.create({
    data: {
      date: appointmentDate,
      slot,
      clientId: req.authUser.id,
      staffId: availableStaff.id,
      serviceId: Number(serviceId),
      gamme: gamme ?? priceKeys[0],
      prix,
    },
    include: {
      service: true,
      staff: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(appointment);
};

export const getMyAppointments = async (req: Request, res: Response) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: req.authUser.id,
    },
    include: {
      service: true,
      review: true,
      staff: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        slot: "asc",
      },
    ],
  });

  res.status(200).json(appointments);
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  const { date, serviceId, excludeId } = req.query;

  if (!date || !serviceId) {
    throw new AppError(
      "Les paramètres date et serviceId sont obligatoires.",
      400,
    );
  }

  const appointmentDate = getAppointmentDate(date as string);

  // Vérifier si la journée est fermée
  const dayBlock = await prisma.blockedSlot.findFirst({
    where: { date: appointmentDate, slot: null },
  });
  if (dayBlock) {
    return res.status(200).json({ date, serviceId: Number(serviceId), slots: [] });
  }

  // Créneaux bloqués pour ce jour
  const blockedSlotRecords = await prisma.blockedSlot.findMany({
    where: { date: appointmentDate, slot: { not: null } },
    select: { slot: true },
  });
  const blockedSlotSet = new Set(blockedSlotRecords.map((b) => b.slot));

  const service = await prisma.service.findUnique({
    where: { id: Number(serviceId) },
  });

  if (!service) {
    throw new AppError("Service introuvable.", 404);
  }

  const assignedTasksWhere: {
    date: Date;
    status: { not: AppointmentStatus };
    NOT?: { id: number };
  } = {
    date: appointmentDate,
    status: { not: AppointmentStatus.CANCELLED },
  };

  if (excludeId) {
    assignedTasksWhere.NOT = { id: Number(excludeId) };
  }

  const staffMembers = await prisma.user.findMany({
    where: {
      droit: { in: [AccessLevel.COLLABORATEUR, AccessLevel.ADMIN] },
    },
    include: {
      assignedTasks: {
        where: assignedTasksWhere,
        include: {
          service: { select: { dureeMinutes: true } },
        },
      },
    },
  });

  const FIRST_SLOT_MINUTES = 8 * 60; // 08:00
  const SLOT_STEP = 30; // toutes les 30 min
  const availableSlots: string[] = [];

  for (
    let minutes = FIRST_SLOT_MINUTES;
    minutes <= LAST_ALLOWED_SLOT_MINUTES;
    minutes += SLOT_STEP
  ) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    const slot = `${hh}:${mm}`;

    const requestedStart = buildDateTimeFromSlot(appointmentDate, slot);
    const requestedEnd = addMinutes(requestedStart, service.dureeMinutes);

    const hasAvailableStaff = staffMembers.some((staff) =>
      staff.assignedTasks.every((task) => {
        const existingStart = buildDateTimeFromSlot(task.date, task.slot);
        const existingEnd = addMinutes(
          existingStart,
          task.service.dureeMinutes,
        );
        return !slotsOverlap(
          requestedStart,
          requestedEnd,
          existingStart,
          existingEnd,
        );
      }),
    );

    if (hasAvailableStaff && !blockedSlotSet.has(slot)) {
      availableSlots.push(slot);
    }
  }

  res.status(200).json({ date: date as string, serviceId: Number(serviceId), slots: availableSlots });
};

export const cancelAppointment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!appointment) {
    throw new AppError("Rendez-vous introuvable.", 404);
  }

  if (appointment.clientId !== req.authUser.id) {
    throw new AppError(
      "Vous n'êtes pas autorisé à modifier ce rendez-vous.",
      403,
    );
  }

  if (
    appointment.status === AppointmentStatus.DONE ||
    appointment.status === AppointmentStatus.CANCELLED
  ) {
    throw new AppError("Ce rendez-vous ne peut pas être annulé.", 400);
  }

  const updated = await prisma.appointment.update({
    where: { id: Number(req.params.id) },
    data: { status: AppointmentStatus.CANCELLED },
    include: {
      service: true,
      review: true,
      staff: { select: { id: true, nom: true, prenom: true, role: true } },
    },
  });

  res.status(200).json(updated);
};

type CreateReviewBody = {
  rating?: number;
  comment?: string;
};

export const createReview = async (
  req: Request<{ id: string }, unknown, CreateReviewBody>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const { rating, comment } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new AppError("La note doit être entre 1 et 5.", 400);
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: Number(req.params.id) },
    include: { review: true },
  });

  if (!appointment) {
    throw new AppError("Rendez-vous introuvable.", 404);
  }

  if (appointment.clientId !== req.authUser.id) {
    throw new AppError(
      "Vous n'êtes pas autorisé à modifier ce rendez-vous.",
      403,
    );
  }

  if (appointment.status !== AppointmentStatus.DONE) {
    throw new AppError(
      "Vous pouvez uniquement laisser un avis sur un rendez-vous terminé.",
      400,
    );
  }

  if (appointment.review) {
    throw new AppError(
      "Vous avez déjà laissé un avis pour ce rendez-vous.",
      400,
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment: comment ?? null,
      appointmentId: Number(req.params.id),
    },
  });

  res.status(201).json(review);
};

type UpdateAppointmentBody = {
  date?: string;
  slot?: string;
  serviceId?: number;
  gamme?: string;
};

export const updateAppointment = async (
  req: Request<{ id: string }, unknown, UpdateAppointmentBody>,
  res: Response,
) => {
  if (!req.authUser?.id) {
    throw new AppError("Utilisateur non authentifie.", 401);
  }

  const { date, slot, serviceId, gamme } = req.body;

  if (!date || !slot || !serviceId) {
    throw new AppError(
      "Les champs date, slot et serviceId sont obligatoires.",
      400,
    );
  }

  const appointmentId = Number(req.params.id);

  const existing = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!existing) {
    throw new AppError("Rendez-vous introuvable.", 404);
  }

  if (existing.clientId !== req.authUser.id) {
    throw new AppError(
      "Vous n'êtes pas autorisé à modifier ce rendez-vous.",
      403,
    );
  }

  if (
    existing.status !== AppointmentStatus.PENDING &&
    existing.status !== AppointmentStatus.CONFIRMED
  ) {
    throw new AppError(
      "Seuls les rendez-vous en attente ou confirmés peuvent être modifiés.",
      400,
    );
  }

  const slotMinutes = parseSlotToMinutes(slot);

  if (slotMinutes > LAST_ALLOWED_SLOT_MINUTES) {
    throw new AppError("Le dernier creneau de debut autorise est 17:00.", 400);
  }

  const appointmentDate = getAppointmentDate(date);

  const service = await prisma.service.findUnique({
    where: { id: Number(serviceId) },
  });

  if (!service) {
    throw new AppError("Service introuvable.", 404);
  }

  const prices = service.prices as Record<string, number>;
  const priceKeys = Object.keys(prices);

  let prix: number | undefined;

  if (priceKeys.length > 1) {
    if (!gamme) {
      throw new AppError(
        `Ce service necessite le choix d'une gamme. Gammes disponibles : ${priceKeys.join(", ")}.`,
        400,
      );
    }

    if (!(gamme in prices)) {
      throw new AppError(
        `Gamme "${gamme}" invalide. Gammes disponibles : ${priceKeys.join(", ")}.`,
        400,
      );
    }

    prix = prices[gamme];
  } else {
    prix = prices[priceKeys[0]];
  }

  const requestedStart = buildDateTimeFromSlot(appointmentDate, slot);
  const requestedEnd = addMinutes(requestedStart, service.dureeMinutes);

  const staffMembers = await prisma.user.findMany({
    where: {
      droit: { in: [AccessLevel.COLLABORATEUR, AccessLevel.ADMIN] },
    },
    include: {
      assignedTasks: {
        where: {
          date: appointmentDate,
          status: { not: AppointmentStatus.CANCELLED },
          NOT: { id: appointmentId },
        },
        include: {
          service: { select: { dureeMinutes: true } },
        },
      },
    },
    orderBy: [{ droit: "desc" }, { createdAt: "asc" }],
  });

  const availableStaff = staffMembers.find((staffMember) =>
    staffMember.assignedTasks.every((task) => {
      const existingStart = buildDateTimeFromSlot(task.date, task.slot);
      const existingEnd = addMinutes(existingStart, task.service.dureeMinutes);
      return !slotsOverlap(requestedStart, requestedEnd, existingStart, existingEnd);
    }),
  );

  if (!availableStaff) {
    throw new AppError(
      "Aucun membre du staff n'est disponible sur ce creneau pour la duree du service.",
      409,
    );
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      date: appointmentDate,
      slot,
      serviceId: Number(serviceId),
      gamme: gamme ?? priceKeys[0],
      prix,
      staffId: availableStaff.id,
      status: AppointmentStatus.PENDING,
    },
    include: {
      service: true,
      review: true,
      staff: { select: { id: true, nom: true, prenom: true, role: true } },
    },
  });

  res.status(200).json(updated);
};

export const getActiveAppointments = async (_req: Request, res: Response) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      status: {
        not: AppointmentStatus.CANCELLED,
      },
    },
    include: {
      client: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
        },
      },
      service: true,
      staff: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
      {
        slot: "asc",
      },
    ],
  });

  res.status(200).json(appointments);
};
