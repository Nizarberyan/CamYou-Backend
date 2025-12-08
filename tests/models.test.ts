import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import User from "../models/User.model";
import Driver from "../models/Driver.model";
// Bun loads .env automatically

// Use a separate test database or mock
const TEST_DB_URI =
  process.env.MONGO_URL || "mongodb://localhost:27017/camyou_test";

describe("Model Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a User successfully", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "user",
    };
    const user = await User.create(userData);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe("user");
  });

  it("should fail to create a User without required fields", async () => {
    try {
      await User.create({ name: "Incomplete User" });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      expect(err.errors.email).toBeDefined();
      expect(err.errors.password).toBeDefined();
    }
  });

  it("should create a Driver successfully", async () => {
    const driverData = {
      name: "Test Driver",
      email: "driver@example.com",
      password: "securepass",
      licenseNumber: "DL123456",
      licenseExpiry: new Date("2030-01-01"),
    };
    const driver = await Driver.create(driverData);
    expect(driver.licenseNumber).toBe(driverData.licenseNumber);
    expect(driver.status).toBe("active");
  });
});
