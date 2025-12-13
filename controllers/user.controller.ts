import type { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      // Access Control: Admin or Self
      if (req.user?.id !== id && req.user?.role !== "admin") {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      const user = await UserService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      // Access Control: Admin or Self
      if (req.user?.id !== id && req.user?.role !== "admin") {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      const updatedUser = await UserService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      await UserService.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      // "Me" vs Admin Reset logic can be handled here or separate endpoints
      // This is "Self Change" logic
      if (req.user?.id !== id && req.user?.role !== "admin") {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      await UserService.changePassword(id, oldPassword, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // Admin force reset
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const { newPassword } = req.body;
      await UserService.resetPassword(id, newPassword);
      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  uploadProfilePhoto: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      // We assume serving static files from /uploads, providing absolute URL or relative path
      // If server is on localhost:3000, we might store "uploads/filename.jpg"
      // Frontend can prepend base URL.
      const filePath = `uploads/${req.file.filename}`;

      const updatedUser = await UserService.updateUser(id, {
        profileImage: filePath,
      });

      res.json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};
