import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceConfig extends Document {
  oilChangeIntervalKm: number;
  inspectionIntervalMonths: number;
  tireRotationIntervalKm: number;
}

const MaintenanceConfigSchema: Schema = new Schema(
  {
    oilChangeIntervalKm: { type: Number, required: true, default: 15000 },
    inspectionIntervalMonths: { type: Number, required: true, default: 12 },
    tireRotationIntervalKm: { type: Number, required: true, default: 20000 },
  },
  { timestamps: true },
);

export default mongoose.model<IMaintenanceConfig>(
  "MaintenanceConfig",
  MaintenanceConfigSchema,
);
