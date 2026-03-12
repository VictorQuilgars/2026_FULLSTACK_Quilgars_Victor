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
        in: [AccessLevel.ADMIN, AccessLevel.SUPER_ADMIN],
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
