import type { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  logger.info(JSON.stringify(req.user));
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
};

export { requireAdmin };
