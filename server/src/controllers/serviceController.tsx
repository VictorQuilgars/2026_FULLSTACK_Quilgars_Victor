import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getServices = async (_req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      nom: true,
      description: true,
      prices: true,
      dureeMinutes: true,
    },
  });

  res.status(200).json(services);
};
