import type { NextFunction, Request, Response } from "express";
import { AccessLevel } from "@prisma/client";
import { protect } from "./protect";
import { AppError } from "../utils/appError";

export const protectAdmin = [
  protect,
  (_req: Request, _res: Response, next: NextFunction) => {
    const user = _req.authUser;
    if (
      !user ||
      (user.droit !== AccessLevel.COLLABORATEUR && user.droit !== AccessLevel.ADMIN)
    ) {
      return next(new AppError("Accès réservé au personnel.", 403));
    }
    next();
  },
];
