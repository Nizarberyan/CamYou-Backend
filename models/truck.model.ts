import mongoose, { Schema, Document } from "mongoose";

export interface ITruck extends Document {
  licensePlate: string;
  brand: string;
  vehicleModel: string;
  year: number;
  vin?: string;
  currentMileage: number;
  fuelType: "diesel" | "petrol" | "electric" | "hybrid";
  fuelCapacity: number;
  assignedDriver?: mongoose.Types.ObjectId;
  status: "available" | "on_trip" | "maintenance" | "inactive";
  lastMaintenanceDate?: Date;
  nextMaintenanceMileage?: number;
  insuranceExpiry?: Date;
  registrationExpiry?: Date;
  maintenanceFlags?: string[];
}

const truckSchema = new Schema<ITruck>(
  {
    licensePlate: {
      type: String,
      required: true,
      unique: true,
    },
    brand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    vin: {
      type: String,
    },
    currentMileage: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: String,
      enum: ["diesel", "petrol", "electric", "hybrid"],
      default: "diesel",
    },
    fuelCapacity: {
      type: Number,
      required: true,
    },
    assignedDriver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["available", "on_trip", "maintenance", "inactive"],
      default: "available",
    },
    lastMaintenanceDate: {
      type: Date,
    },
    nextMaintenanceMileage: {
      type: Number,
    },
    insuranceExpiry: {
      type: Date,
    },
    registrationExpiry: {
      type: Date,
    },
    maintenanceFlags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITruck>("Truck", truckSchema);
