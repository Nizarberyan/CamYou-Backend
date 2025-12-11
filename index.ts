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
import { requireAdmin } from "./middleware/admin.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
const app = express();

app.use(express.json());
app.use(morganMiddleware);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", authMiddleware, requireAdmin, adminRoutes);
app.use("/api/trucks", authMiddleware, truckRoutes);
app.use("/api/trailers", authMiddleware, trailerRoutes);
app.use("/api/tires", authMiddleware, tireRoutes);
try {
  connectDB();
} catch (error) {
  logger.error("MongoDB connection error:", error);
}
app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server started on port ${process.env.PORT || 3000}`);
});
