import type { Request, Response } from "express";
import AuthService from "../services/auth.service";
const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to register user", error });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to login", error });
    }
  },

  getMe: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }
      const user = await AuthService.getMe(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user info", error });
    }
  },
};

export default authController;
