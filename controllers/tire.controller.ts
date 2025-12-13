import type { Request, Response } from "express";
import TireService from "../services/tire.service";

const TireController = {
  create: async (req: Request, res: Response) => {
    try {
      const tire = await TireService.createTire(req.body);
      res.status(201).json(tire);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const tires = await TireService.getAllTires(req.query);
      res.status(200).json(tires);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const tire = await TireService.getTireById(req.params.id as string);
      if (!tire) {
        // Fix: Add braces and return explicitly to avoid implicit return issue
        res.status(404).json({ message: "Tire not found" });
        return;
      }
      res.status(200).json(tire);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const tire = await TireService.updateTire(
        req.params.id as string,
        req.body,
      );
      if (!tire) {
        res.status(404).json({ message: "Tire not found" });
        return;
      }
      res.status(200).json(tire);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const tire = await TireService.deleteTire(req.params.id as string);
      if (!tire) {
        res.status(404).json({ message: "Tire not found" });
        return;
      }
      res.status(200).json({ message: "Tire deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getHistory: async (req: Request, res: Response) => {
    try {
      const history = await TireService.getTireHistory(req.params.id as string);
      res.status(200).json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  addHistory: async (req: Request, res: Response) => {
    try {
      const historyEntry = await TireService.addHistoryEntry(
        req.params.id as string,
        req.body,
      );
      res.status(201).json(historyEntry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default TireController;
