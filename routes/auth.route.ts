import { Router } from "express";
import validate from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import {
  createUserSchema,
  loginUserSchema,
} from "../validations/user.validation";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validate(createUserSchema),
  AuthController.register,
);
router.post("/login", validate(loginUserSchema), AuthController.login);
router.get("/me", authMiddleware, AuthController.getMe);

export default router;
