import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Truck from "../models/truck.model";
import User from "../models/user.model";

const TEST_DB_URI =
  process.env.MONGO_TEST_URL || "mongodb://localhost:27017/camyou_test";

describe("Truck Management Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a Truck successfully", async () => {
    const truckData = {
      licensePlate: "AB-123-CD",
      brand: "Volvo",
      vehicleModel: "FH16",
      year: 2023,
      fuelCapacity: 500,
      fuelType: "diesel", // Add required field
    };

    const truck = await Truck.create(truckData);
    expect(truck.licensePlate).toBe(truckData.licensePlate);
    expect(truck.status).toBe("available");
  });

  it("should fail to create a Truck with duplicate license plate", async () => {
    const truckData = {
      licensePlate: "AB-123-CD", // Same as above
      brand: "Scania",
      vehicleModel: "R450",
      year: 2022,
      fuelCapacity: 400,
    };

    try {
      await Truck.create(truckData);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as any).code).toBe(11000);
    }
  });

  it("should assign a driver to a Truck", async () => {
    // Create a user first
    const user = await User.create({
      name: "Driver 1",
      email: "driver1@test.com",
      password: "password",
      role: "driver",
    });

    const truck = await Truck.create({
      licensePlate: "XY-999-ZZ",
      brand: "Mercedes",
      vehicleModel: "Actros",
      year: 2024,
      fuelCapacity: 600,
      assignedDriver: user._id,
    });

    const foundTruck = await Truck.findById(truck._id).populate(
      "assignedDriver",
    );
    expect(foundTruck?.assignedDriver).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((foundTruck?.assignedDriver as any).name).toBe("Driver 1");
  });
});
