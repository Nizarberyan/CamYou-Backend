import type { Request, Response } from "express";
import MaintenanceService from "../services/maintenance.service";
import Truck from "../models/truck.model";
import MaintenanceConfigService from "../services/maintenanceConfig.service";
import Trailer from "../models/trailer.model";

const MaintenanceController = {
    performMaintenance: async (req: Request, res: Response) => {
        try {
            const { vehicleId } = req.params;
            const { notes } = req.body;

            if (!vehicleId) {
                res.status(400).json({ message: "Vehicle ID is required" });
                return;
            }

            if (!notes) {
                res.status(400).json({ message: "Maintenance notes are required" });
                return;
            }

            const vehicle = await MaintenanceService.performMaintenance(vehicleId, notes);
            if (!vehicle) {
                res.status(404).json({ message: "Vehicle not found" });
                return;
            }

            res.status(200).json(vehicle);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    logInspection: async (req: Request, res: Response) => {
        try {
            const { vehicleId } = req.params;
            const { vehicleModel, notes, status } = req.body; // status: 'good' | 'issues_found'

            if (!vehicleId) {
                res.status(400).json({ message: "Vehicle ID is required" });
                return;
            }

            const log = await MaintenanceService.logInspection(vehicleId, vehicleModel, notes, status);
            res.status(201).json(log);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getMaintenanceStatus: async (req: Request, res: Response) => {
        try {
            const [trucks, trailers] = await Promise.all([
                Truck.find({
                    $or: [
                        { status: "maintenance" },
                        { maintenanceFlags: { $exists: true, $not: { $size: 0 } } },
                    ],
                }).lean(),
                Trailer.find({
                    $or: [
                        { status: "maintenance" },
                        { maintenanceFlags: { $exists: true, $not: { $size: 0 } } },
                    ],
                }).lean(),
            ]);

            const normalizedTrucks = trucks.map((t: any) => ({
                ...t,
                vehicleType: "Truck",
                maintenanceFlags: t.maintenanceFlags || [],
                // Ensure vehicleModel is present (it is in Truck model)
            }));

            const normalizedTrailers = trailers.map((t: any) => ({
                ...t,
                vehicleType: "Trailer",
                vehicleModel: t.type, // Map 'type' to 'vehicleModel' for consistency
                currentMileage: undefined, // Explicitly undefined for trailers
                maintenanceFlags: t.maintenanceFlags || [],
            }));

            res.status(200).json([...normalizedTrucks, ...normalizedTrailers]);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getMaintenanceHistory: async (req: Request, res: Response) => {
        try {
            const { vehicleId } = req.query;
            const history = await MaintenanceService.getMaintenanceHistory(
                vehicleId as string,
            );
            res.status(200).json(history);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getConfig: async (req: Request, res: Response) => {
        try {
            const config = await MaintenanceConfigService.getConfig();
            res.status(200).json(config);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    updateConfig: async (req: Request, res: Response) => {
        try {
            const config = await MaintenanceConfigService.updateConfig(req.body);
            res.status(200).json(config);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default MaintenanceController;
