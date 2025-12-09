import type { Request, Response } from "express";
import DriverService from "../services/driver.service";

const driverController = {
  getDrivers: async (req: Request, res: Response) => {
    try {
      const drivers = await DriverService.getDrivers();
      res.status(200).json(drivers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get drivers", error });
    }
  },

  getDriverById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const driver = await DriverService.getDriverById(req.params.id);
      if (!driver) {
        res.status(404).json({ message: "Driver not found" });
        return;
      }
      res.status(200).json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to get driver", error });
    }
  },

  createDriver: async (req: Request, res: Response) => {
    try {
      const driver = await DriverService.createDriver(req.body);
      res.status(201).json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to create driver", error });
    }
  },

  updateDriver: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const driver = await DriverService.updateDriver(req.params.id, req.body);
      if (!driver) {
        res.status(404).json({ message: "Driver not found" });
        return;
      }
      res.status(200).json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to update driver", error });
    }
  },

  deleteDriver: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const driver = await DriverService.deleteDriver(req.params.id);
      if (!driver) {
        res.status(404).json({ message: "Driver not found" });
        return;
      }
      res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete driver", error });
    }
  },
};
export default driverController;
