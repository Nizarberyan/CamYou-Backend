import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
  vehicle: mongoose.Types.ObjectId;
  vehicleModel: "Truck" | "Trailer";
  description: string; // The "notes" entered by the user
  date: Date;
  type: "scheduled" | "repair" | "inspection";
  cost?: number; // Optional tracking
  performedBy?: string; // Could be a mechanic name or user ID
}

const MaintenanceLogSchema: Schema = new Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "vehicleModel",
    },
    vehicleModel: {
      type: String,
      required: true,
      enum: ["Truck", "Trailer"],
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ["scheduled", "repair", "inspection"],
      default: "repair",
    },
    cost: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IMaintenanceLog>(
  "MaintenanceLog",
  MaintenanceLogSchema,
);
