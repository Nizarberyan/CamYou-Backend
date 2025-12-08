import mongoose from "mongoose";
import logger from "../config/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
  }
};

export default connectDB;
