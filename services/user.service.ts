import User, { type IUser } from "../models/user.model";
import bcrypt from "bcryptjs";

export const UserService = {
  getAllUsers: async () => {
    return User.find().select("-password").sort({ createdAt: -1 });
  },

  getUserById: async (id: string) => {
    return User.findById(id).select("-password");
  },

  createUser: async (data: Partial<IUser>) => {
    const { email, password, ...rest } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    return User.create({
      email,
      password: hashedPassword,
      ...rest,
    });
  },

  updateUser: async (id: string, data: Partial<IUser>) => {
    // Prevent password update via this method
    const { password, ...updateData } = data;
    return User.findByIdAndUpdate(id, updateData, { new: true }).select(
      "-password",
    );
  },

  deleteUser: async (id: string) => {
    return User.findByIdAndDelete(id);
  },

  changePassword: async (id: string, oldPass: string, newPass: string) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    // Assert password presence as it's required in schema
    if (!user.password) throw new Error("User has no password set");

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new Error("Incorrect old password");

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();
    return true;
  },

  // Admin override to specific password without checking old one
  resetPassword: async (id: string, newPass: string) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();
    return true;
  },
};
