import { Router } from "express";
import DriverController from "../controllers/driver.controller";

const router = Router();

router.get("/", DriverController.getDrivers);
router.post("/", DriverController.createDriver);

export default router;
