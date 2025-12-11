import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin" | "driver";
  licenseNumber?: string;
  licenseExpiry?: Date;
  status?: "active" | "inactive" | "on_trip";
  profileImage?: string; // URL to the profile image
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
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
    role: {
      type: String,
      enum: ["user", "admin", "driver"],
      default: "user",
    },
    licenseNumber: {
      type: String,
    },
    licenseExpiry: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on_trip"],
      default: "active",
    },
    profileImage: {
      type: String,
      default: "", // Or provide a default placeholder URL if preferred
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
