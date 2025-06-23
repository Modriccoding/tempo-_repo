import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

interface AuthRequest extends Request {
  user?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      accessToken: string;
      refreshToken: string;
    };

    req.user = {
      accessToken: decoded.accessToken,
      refreshToken: decoded.refreshToken,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};
