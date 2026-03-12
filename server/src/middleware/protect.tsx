import type { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { AppError } from "../utils/appError";

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Token d'authentification manquant.", 401));
  }

  const token = authorization.replace("Bearer ", "").trim();

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return next(new AppError("Token Supabase invalide ou expire.", 401));
  }

  req.authUser = data.user;
  next();
};
