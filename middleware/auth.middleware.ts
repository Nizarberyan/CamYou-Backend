import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
            id: string;
        };
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
