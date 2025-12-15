import express from "express";
import trailerController from "../controllers/trailer.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import validate from "../middleware/validate.middleware";
import {
  createTrailerSchema,
  updateTrailerSchema,
} from "../validations/trailer.validation";

const router = express.Router();

router.use(authMiddleware);

// Public routes for authenticated users (Drivers + Admin)
router.get("/", trailerController.getTrailers);
router.get("/:id", trailerController.getTrailerById);

// Admin only routes for managing trailers
router.post(
  "/",
  requireAdmin,
  validate(createTrailerSchema),
  trailerController.createTrailer,
);
router.put(
  "/:id",
  requireAdmin,
  validate(updateTrailerSchema),
  trailerController.updateTrailer,
);
router.delete("/:id", requireAdmin, trailerController.deleteTrailer);

export default router;
