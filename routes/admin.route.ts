import express from "express";
import driverController from "../controllers/driver.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Driver management routes
router.post("/drivers", authMiddleware, driverController.createDriver);
router.get("/drivers", authMiddleware, driverController.getDrivers);
router.get("/drivers/:id", authMiddleware, driverController.getDriverById);
router.put("/drivers/:id", authMiddleware, driverController.updateDriver);
router.delete("/drivers/:id", authMiddleware, driverController.deleteDriver);

export default router;
