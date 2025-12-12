import type { Request, Response } from "express";
import TruckService from "../services/truck.service";
import MaintenanceService from "../services/maintenance.service";

const truckController = {
  getTrucks: async (req: Request, res: Response) => {
    try {
      const trucks = await TruckService.getTrucks();
      res.status(200).json(trucks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trucks", error });
    }
  },

  getTruckById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Truck ID is required" });
        return;
      }

      const truck = await TruckService.getTruckById(id);
      if (!truck) {
        res.status(404).json({ message: "Truck not found" });
        return;
      }
      res.status(200).json(truck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch truck", error });
    }
  },

  createTruck: async (req: Request, res: Response) => {
    try {
      const truck = await TruckService.createTruck(req.body);
      res.status(201).json(truck);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 11000) {
        res.status(400).json({ message: "License plate already exists" });
        return;
      }
      res.status(500).json({ message: "Failed to create truck", error });
    }
  },

  updateTruck: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Truck ID is required" });
        return;
      }

      const truck = await TruckService.updateTruck(id, req.body);
      if (!truck) {
        res.status(404).json({ message: "Truck not found" });
        return;
      }
      res.status(200).json(truck);
    } catch (error) {
      res.status(500).json({ message: "Failed to update truck", error });
    }
  },

  deleteTruck: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Truck ID is required" });
        return;
      }

      const truck = await TruckService.deleteTruck(id);
      if (!truck) {
        res.status(404).json({ message: "Truck not found" });
        return;
      }
      res.status(200).json({ message: "Truck deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete truck", error });
    }
  },

  performMaintenance: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!id) {
        res.status(400).json({ message: "Truck ID is required" });
        return;
      }

      const truck = await MaintenanceService.performMaintenance(id, notes);
      if (!truck) {
        res.status(404).json({ message: "Truck not found" });
        return;
      }
      res.status(200).json(truck);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (error as any).message;
      res
        .status(500)
        .json({ message: "Failed to perfom maintenance", error: message });
    }
  },
};

export default truckController;
