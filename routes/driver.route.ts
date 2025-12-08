import { Router } from "express";
import validate from "../middleware/validate";
import { createDriverSchema } from "../validations/driver.validation";

const router = Router();

router.post("/", validate(createDriverSchema), (req, res) => {
    
});

export default router;
