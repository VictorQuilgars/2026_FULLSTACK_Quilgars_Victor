import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route introuvable: ${req.originalUrl}`, 404));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      message: "Erreur Prisma.",
      code: error.code,
    });
  }

  console.error(error);

  return res.status(500).json({ message: "Erreur interne du serveur." });
};
