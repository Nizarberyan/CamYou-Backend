import mongoose, { Schema, Document } from "mongoose";

export interface ITireHistory extends Document {
    tire: mongoose.Types.ObjectId;
    treadDepth: number;
    date: Date;
    notes?: string;
    type: "inspection" | "replacement" | "rotation" | "repair";
}

const TireHistorySchema: Schema = new Schema(
    {
        tire: { type: Schema.Types.ObjectId, ref: "Tire", required: true },
        treadDepth: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        notes: { type: String },
        type: {
            type: String,
            enum: ["inspection", "replacement", "rotation", "repair"],
            default: "inspection",
        },
    },
    { timestamps: true },
);

export default mongoose.model<ITireHistory>("TireHistory", TireHistorySchema);
