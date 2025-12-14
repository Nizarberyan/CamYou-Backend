import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  date: Date;
  totalMiles: number;
  totalFuel: number;
  activeTrips: number;
  completedTrips: number;
  createdAt: Date;
  totalExpenses: number;
}

const reportSchema = new Schema<IReport>(
  {
    date: {
      type: Date,
      required: true,
      unique: true, // One report per day
    },
    totalMiles: {
      type: Number,
      default: 0,
    },
    totalFuel: {
      type: Number,
      default: 0,
    },
    activeTrips: {
      type: Number,
      default: 0,
    },
    completedTrips: {
      type: Number,
      default: 0,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IReport>("Report", reportSchema);
