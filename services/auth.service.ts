import User from "../models/User.model";
import jwt from "jsonwebtoken";

const AuthService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: async (userData: any) => {
    const { name, email, password } = userData;
    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      message: "User registered successfully",
      token,
      data: userResponse,
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
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    );

    return { message: "Login successful", token };
  },
};

export default AuthService;
