import express from "express";
import MaintenanceController from "../controllers/maintenance.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.use(authMiddleware);
// router.use(requireAdmin); // Removed blanket admin requirement

// Admin Only Routes
router.post("/:truckId/perform", requireAdmin, MaintenanceController.performMaintenance);
router.get("/status", requireAdmin, MaintenanceController.getMaintenanceStatus);
router.get("/config", requireAdmin, MaintenanceController.getConfig);
router.put("/config", requireAdmin, MaintenanceController.updateConfig);

// Authenticated Routes (Drivers + Admin)
router.post("/:vehicleId/inspection", MaintenanceController.logInspection);
router.get("/history", MaintenanceController.getMaintenanceHistory);

export default router;
