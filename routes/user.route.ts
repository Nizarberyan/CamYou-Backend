import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Admin only routes
router.get("/", requireAdmin, UserController.getAllUsers);
router.post("/", requireAdmin, UserController.createUser);



router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", requireAdmin, UserController.deleteUser);
router.put("/:id/password", UserController.changePassword);
router.post("/:id/reset-password", requireAdmin, UserController.resetPassword);
router.post("/:id/photo", upload.single("photo"), UserController.uploadProfilePhoto);

export default router;
