import express from "express";
import connectDB from "./config/db";
import logger from "./config/logger";
import morganMiddleware from "./middleware/morgan";
import userRoutes from "./routes/user.route";
import driverRoutes from "./routes/driver.route";

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
try {
    connectDB();
} catch (error) {
    logger.error("MongoDB connection error:", error);
}
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server started on port ${process.env.PORT || 3000}`);
});
