import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
    name: string;
    email: string;
    password?: string;
    licenseNumber: string;
    licenseExpiry: Date;
    status: "active" | "inactive" | "on_trip";
}

const driverSchema = new Schema<IDriver>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        licenseNumber: {
            type: String,
            required: true,
        },
        licenseExpiry: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "on_trip"],
            default: "active",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IDriver>("Driver", driverSchema);
