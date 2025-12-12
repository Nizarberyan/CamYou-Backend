import express from "express";
import truckController from "../controllers/truck.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import validate from "../middleware/validate.middleware";
import {
  createTruckSchema,
  updateTruckSchema,
} from "../validations/truck.validation";

const router = express.Router();

router.use(authMiddleware);

// Admin only routes for managing trucks
router.post(
  "/",
  requireAdmin,
  validate(createTruckSchema),
  truckController.createTruck,
);
router.get("/", requireAdmin, truckController.getTrucks);
router.get("/:id", requireAdmin, truckController.getTruckById);
router.put(
  "/:id",
  requireAdmin,
  validate(updateTruckSchema),
  truckController.updateTruck,
);
router.post(
  "/:id/maintenance",
  requireAdmin,
  truckController.performMaintenance,
);
router.delete("/:id", requireAdmin, truckController.deleteTruck);

export default router;
