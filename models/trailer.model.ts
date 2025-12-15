import mongoose, { Schema, Document } from "mongoose";

export interface ITrailer extends Document {
  licensePlate: string;
  type: "flatbed" | "refrigerated" | "box" | "tanker" | "other";
  capacityWeight: number; // in kg
  capacityVolume?: number; // in cubic meters
  brand: string;
  year: number;
  vin?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  status: "available" | "on_trip" | "maintenance" | "inactive";
  assignedTruck?: mongoose.Types.ObjectId;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceFlags: string[];
}

const trailerSchema = new Schema<ITrailer>(
  {
    licensePlate: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["flatbed", "refrigerated", "box", "tanker", "other"],
      required: true,
      default: "box",
    },
    capacityWeight: { type: Number, required: true },
    capacityVolume: { type: Number },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    status: {
      type: String,
      enum: ["available", "on_trip", "maintenance", "inactive"],
      default: "available",
    },
    assignedTruck: { type: Schema.Types.ObjectId, ref: "Truck" },
    lastMaintenanceDate: { type: Date },
    nextMaintenanceDate: { type: Date },
    maintenanceFlags: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<ITrailer>("Trailer", trailerSchema);
