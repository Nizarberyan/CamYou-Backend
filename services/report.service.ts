import Trip from "../models/trip.model";
import Report, { type IReport } from "../models/report.model";
import logger from "../config/logger";

const ReportService = {
  generateDailyReport: async (date: Date = new Date()): Promise<IReport> => {
    // Normalize date to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Filter for trips completed within this day range
    // Note: We use endDate for aggregation
    const completedTrips = await Trip.find({
      status: "completed",
      endDate: { $gte: startOfDay, $lte: endOfDay },
    });

    const activeTripsCount = await Trip.countDocuments({
      status: "in_progress",
    });

    const totalMiles = completedTrips.reduce(
      (sum, trip) => sum + (trip.actualDistance || 0),
      0,
    );
    const totalFuel = completedTrips.reduce(
      (sum, trip) => sum + (trip.fuelAdded || 0),
      0,
    );

    const totalExpenses = completedTrips.reduce((sum, trip) => {
      const tripExpenses =
        trip.expenses?.reduce((expSum, exp) => expSum + (exp.amount || 0), 0) ||
        0;
      return sum + tripExpenses;
    }, 0);

    const reportData = {
      date: startOfDay,
      totalMiles,
      totalFuel,
      totalExpenses,
      activeTrips: activeTripsCount,
      completedTrips: completedTrips.length,
    };

    try {
      // Upsert report for this date
      const report = await Report.findOneAndUpdate(
        { date: startOfDay },
        reportData,
        { new: true, upsert: true },
      );
      logger.info(
        `Generated daily report for ${startOfDay.toISOString().split("T")[0]}`,
      );
      return report;
    } catch (error) {
      logger.error("Failed to generate report", error);
      throw error;
    }
  },

  getReports: async (limit: number = 30): Promise<IReport[]> => {
    return await Report.find().sort({ date: -1 }).limit(limit);
  },

  getReportById: async (id: string): Promise<IReport | null> => {
    return await Report.findById(id);
  },
};

export default ReportService;
