import type { Request, Response } from "express";
import TripService from "../services/trip.service";
import PDFService from "../services/pdf.service";

const TripController = {
  create: async (req: Request, res: Response) => {
    try {
      const trip = await TripService.createTrip(req.body);
      res.status(201).json(trip);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const trips = await TripService.getAllTrips(req.query);
      res.status(200).json(trips);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const trip = await TripService.getTripById(req.params.id as string);
      if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
      }
      res.status(200).json(trip);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const trip = await TripService.updateTrip(
        req.params.id as string,
        req.body,
      );
      if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
      }
      res.status(200).json(trip);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const trip = await TripService.deleteTrip(req.params.id as string);
      if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
      }
      res.status(200).json({ message: "Trip deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status, endMileage, fuelAdded, notes } = req.body;
      const trip = await TripService.updateStatus(
        req.params.id as string,
        status,
        {
          endMileage,
          fuelAdded,
          notes,
        },
      );
      res.status(200).json(trip);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  downloadWorkOrder: async (req: Request, res: Response) => {
    try {
      const trip = await TripService.getTripById(req.params.id as string);
      if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
      }
      PDFService.generateTripWorkOrder(trip, res);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  addExpense: async (req: Request, res: Response) => {
    try {
      const { type, amount, description, date } = req.body;
      if (!type || !amount) {
        res.status(400).json({ message: "Type and amount are required" });
        return;
      }

      const trip = await TripService.addExpense(req.params.id as string, {
        type,
        amount,
        description,
        date,
      });

      if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
      }
      res.status(200).json(trip);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default TripController;
