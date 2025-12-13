import mongoose, { Schema, Document } from "mongoose";

export interface ITrip extends Document {
  tripNumber: string;
  driver: mongoose.Types.ObjectId;
  truck: mongoose.Types.ObjectId;
  trailer?: mongoose.Types.ObjectId;
  startLocation: string;
  endLocation: string;
  scheduledDate: Date;
  startDate?: Date;
  endDate?: Date;
  startMileage?: number;
  endMileage?: number;
  fuelAdded?: number;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  estimatedDistance?: number; // in km
  actualDistance?: number;
  notes?: string;
  expenses?: {
    type: string;
    amount: number;
    description: string;
    date: Date;
    receiptUrl?: string; // Optional for now
  }[];
}

const tripSchema = new Schema<ITrip>(
  {
    tripNumber: { type: String, required: true, unique: true },
    driver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    truck: { type: Schema.Types.ObjectId, ref: "Truck", required: true },
    trailer: { type: Schema.Types.ObjectId, ref: "Trailer" },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    startMileage: { type: Number },
    endMileage: { type: Number },
    fuelAdded: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "cancelled"],
      default: "planned",
    },
    estimatedDistance: { type: Number },
    actualDistance: { type: Number },
    notes: { type: String },
    expenses: [
      {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        date: { type: Date, default: Date.now },
        receiptUrl: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ITrip>("Trip", tripSchema);
