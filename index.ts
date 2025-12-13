import express from "express";
import connectDB from "./config/db";
import logger from "./config/logger";
import morganMiddleware from "./middleware/morgan.middleware";
import path from "path";
import authRoutes from "./routes/auth.route";
import driverRoutes from "./routes/driver.route";
import adminRoutes from "./routes/admin.route";
import truckRoutes from "./routes/truck.route";
import trailerRoutes from "./routes/trailer.route";
import tireRoutes from "./routes/tire.route";
import tripRoutes from "./routes/trip.route";
import maintenanceRoutes from "./routes/maintenance.route";
import reportRoutes from "./routes/report.route";
import userRoutes from "./routes/user.route";
import { requireAdmin } from "./middleware/admin.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import initCronJobs from "./jobs/cron";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(morganMiddleware);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", authMiddleware, requireAdmin, adminRoutes);
app.use("/api/trucks", authMiddleware, truckRoutes);
app.use("/api/trailers", authMiddleware, trailerRoutes);
app.use("/api/tires", authMiddleware, tireRoutes);
app.use("/api/trips", authMiddleware, tripRoutes);
app.use("/api/maintenance", authMiddleware, requireAdmin, maintenanceRoutes);
app.use("/api/reports", authMiddleware, requireAdmin, reportRoutes);

try {
  connectDB();
  initCronJobs();
} catch (error) {
  logger.error("MongoDB connection error:", error);
}
app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server started on port ${process.env.PORT || 3000}`);
});
