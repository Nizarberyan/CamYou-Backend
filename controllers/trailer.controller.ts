import type { Request, Response } from "express";
import TrailerService from "../services/trailer.service";

const trailerController = {
  getTrailers: async (req: Request, res: Response) => {
    try {
      const trailers = await TrailerService.getTrailers();
      res.status(200).json(trailers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trailers", error });
    }
  },

  getTrailerById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Trailer ID is required" });
        return;
      }

      const trailer = await TrailerService.getTrailerById(id);
      if (!trailer) {
        res.status(404).json({ message: "Trailer not found" });
        return;
      }
      res.status(200).json(trailer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trailer", error });
    }
  },

  createTrailer: async (req: Request, res: Response) => {
    try {
      const trailer = await TrailerService.createTrailer(req.body);
      res.status(201).json(trailer);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 11000) {
        res.status(400).json({ message: "License plate already exists" });
        return;
      }
      res.status(500).json({ message: "Failed to create trailer", error });
    }
  },

  updateTrailer: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Trailer ID is required" });
        return;
      }

      const trailer = await TrailerService.updateTrailer(id, req.body);
      if (!trailer) {
        res.status(404).json({ message: "Trailer not found" });
        return;
      }
      res.status(200).json(trailer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update trailer", error });
    }
  },

  deleteTrailer: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Trailer ID is required" });
        return;
      }

      const trailer = await TrailerService.deleteTrailer(id);
      if (!trailer) {
        res.status(404).json({ message: "Trailer not found" });
        return;
      }
      res.status(200).json({ message: "Trailer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trailer", error });
    }
  },
};

export default trailerController;
