import type { Request, Response } from "express";
import ReportService from "../services/report.service";
import PDFService from "../services/pdf.service";

const ReportController = {
    getDailyReports: async (req: Request, res: Response) => {
        try {
            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 30;
            const reports = await ReportService.getReports(limit);
            res.status(200).json(reports);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    generateDailyReport: async (req: Request, res: Response) => {
        try {

            const report = await ReportService.generateDailyReport();
            res.status(201).json(report);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    downloadReportPDF: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Report ID is required" });
                return;
            }

            const report = await ReportService.getReportById(id);
            if (!report) {
                res.status(404).json({ message: "Report not found" });
                return;
            }

            await PDFService.generateDailyReportPDF(report, res);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default ReportController;
