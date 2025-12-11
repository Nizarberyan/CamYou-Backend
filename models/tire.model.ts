import mongoose, { Schema, Document } from "mongoose";

export interface ITire extends Document {
    serialNumber: string;
    brand: string;
    size: string;
    status: "in_use" | "spare" | "maintenance" | "scrap";
    condition: "new" | "good" | "worn" | "damaged";
    treadDepth: number; // in mm
    purchaseDate?: Date;
    assignedTo?: mongoose.Types.ObjectId; // ID of Truck or Trailer
    assignedToModel?: "Truck" | "Trailer";
    position?: string; // e.g. "Front-Left"
}

const tireSchema = new Schema<ITire>(
    {
        serialNumber: { type: String, required: true, unique: true },
        brand: { type: String, required: true },
        size: { type: String, required: true },
        status: {
            type: String,
            enum: ["in_use", "spare", "maintenance", "scrap"],
            default: "spare",
        },
        condition: {
            type: String,
            enum: ["new", "good", "worn", "damaged"],
            default: "new",
        },
        treadDepth: { type: Number, required: true },
        purchaseDate: { type: Date },
        assignedTo: { type: Schema.Types.ObjectId, refPath: "assignedToModel" },
        assignedToModel: { type: String, enum: ["Truck", "Trailer"] },
        position: { type: String },
    },
    { timestamps: true },
);

export default mongoose.model<ITire>("Tire", tireSchema);
