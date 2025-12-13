import express from "express";
import ReportController from "../controllers/report.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = express.Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/daily", ReportController.getDailyReports);
router.post("/generate", ReportController.generateDailyReport);
router.get("/:id/pdf", ReportController.downloadReportPDF);

export default router;
