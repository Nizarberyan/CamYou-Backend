import express from "express";
import MaintenanceController from "../controllers/maintenance.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin); 

router.post("/:truckId/perform", MaintenanceController.performMaintenance);
router.get("/status", MaintenanceController.getMaintenanceStatus);

export default router;
