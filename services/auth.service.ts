import User from "../models/user.model";
import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/blacklistedToken.model";

const AuthService = {
  logout: async (token: string) => {
    await BlacklistedToken.create({ token });
    return { message: "Logout successful" };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (userData: any) => {
    const { name, email, password, profileImage } = userData;

    const userCount = await User.countDocuments();
    let role = "driver";
    let status = "inactive";

    if (userCount === 0) {
      role = "admin";
      status = "active";
    }

    const user = await User.create({
      name,
      email,
      password,
      profileImage,
      role,
      status,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      message: "User registered successfully",
      token,
      user: userResponse,
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: async (credentials: any) => {
    const { email, password } = credentials;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      message: "Login successful",
      token,
      user: userResponse,
    };
  },

  getMe: async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};

export default AuthService;
