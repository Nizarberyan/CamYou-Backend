import mongoose, { Schema, Document } from "mongoose";

export interface IBlacklistedToken extends Document {
    token: string;
    createdAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
    {
        token: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now, expires: "1h" }, // Auto-delete after 1h (match JWT expiry)
    },
    { timestamps: true },
);

export default mongoose.model<IBlacklistedToken>(
    "BlacklistedToken",
    blacklistedTokenSchema,
);
