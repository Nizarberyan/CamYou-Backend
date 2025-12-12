import cron from "node-cron";
import ReportService from "../services/report.service";
import logger from "../config/logger";

const initCronJobs = () => {
  // Run at 00:00 (Midnight) every day
  cron.schedule("0 0 * * *", async () => {
    logger.info("Running daily report job...");
    try {
      // Generate report for the previous day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await ReportService.generateDailyReport(yesterday);
    } catch (error) {
      logger.error("Error in daily report job:", error);
    }
  });

  logger.info("Cron jobs initialized.");
};

export default initCronJobs;
