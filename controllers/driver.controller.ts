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
    createDriver: async (req: Request, res: Response) => {
        try {
            const driver = await DriverService.createDriver(req.body);
            res.status(201).json(driver);
        } catch (error) {
            res.status(500).json({ message: "Failed to create driver", error });
        }
    }
}
export default driverController;
