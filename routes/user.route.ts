import { Router } from "express";
import validate from "../middleware/validate";
import { createUserSchema, loginUserSchema } from "../validations/user.validation";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", validate(createUserSchema), AuthController.register);
router.post("/login", validate(loginUserSchema), AuthController.login);

export default router;
