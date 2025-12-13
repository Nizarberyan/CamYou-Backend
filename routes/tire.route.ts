import express from "express";
import TireController from "../controllers/tire.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import validate from "../middleware/validate.middleware";
import {
  createTireSchema,
  updateTireSchema,
} from "../validations/tire.validation";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  requireAdmin,
  validate(createTireSchema),
  TireController.create,
);
router.get("/", requireAdmin, TireController.getAll);
router.get("/:id", requireAdmin, TireController.getById);
router.get("/:id/history", requireAdmin, TireController.getHistory);
router.post("/:id/history", requireAdmin, TireController.addHistory);
router.put(
  "/:id",
  requireAdmin,
  validate(updateTireSchema),
  TireController.update,
);
router.delete("/:id", requireAdmin, TireController.delete);

export default router;
