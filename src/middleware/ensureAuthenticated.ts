import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

interface IPayLoad {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    throw new AppError("Token não informado", 401);
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayLoad;

    req.user_id = sub;

    return next();
  } catch (error) {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
