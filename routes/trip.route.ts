import express from "express";
import TripController from "../controllers/trip.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import validate from "../middleware/validate.middleware";
import {
  createTripSchema,
  updateTripSchema,
  tripStatusSchema,
} from "../validations/trip.validation";

const router = express.Router();

router.use(authMiddleware);

// Admin routes for trips
router.post(
  "/",
  requireAdmin,
  validate(createTripSchema),
  TripController.create,
);
router.get("/", TripController.getAll); 
router.get("/:id", TripController.getById);

router.patch(
  "/:id/status",
  validate(tripStatusSchema),
  TripController.updateStatus,
);

router.get("/:id/work-order", TripController.downloadWorkOrder);

router.put(
  "/:id",
  requireAdmin,
  validate(updateTripSchema),
  TripController.update,
);
router.delete("/:id", requireAdmin, TripController.delete);

export default router;
