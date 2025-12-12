import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Trip from "../models/trip.model";
import Truck from "../models/truck.model";
import User from "../models/user.model";
import TripService from "../services/trip.service";

describe("Trip Conflict Detection Tests", () => {
  let driverId: string;
  let truckId: string;
  const TRIP_DATE = new Date("2024-01-01");

  beforeAll(async () => {
    if (!process.env.MONGO_TEST_URL) {
      throw new Error("MONGO_TEST_URL is not defined");
    }
    await mongoose.connect(process.env.MONGO_TEST_URL);
    await Trip.deleteMany({});
    await Truck.deleteMany({});
    await User.deleteMany({});

    // Create resources
    const driver = await User.create({
      name: "Driver 1",
      email: "d1@test.com",
      password: "p",
      role: "driver",
    });
    driverId = driver._id.toString();

    const truck = await Truck.create({
      licensePlate: "CONF-TRK",
      brand: "B",
      vehicleModel: "M",
      year: 2020,
      fuelCapacity: 100,
      status: "available",
    });
    truckId = truck._id.toString();

    // Create Initial Trip
    await TripService.createTrip({
      tripNumber: "TRIP-A",
      driver: new mongoose.Types.ObjectId(driverId),
      truck: new mongoose.Types.ObjectId(truckId),
      startLocation: "A",
      endLocation: "B",
      scheduledDate: TRIP_DATE,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should fail to create a trip for the same driver on the same day", async () => {
    const result = TripService.createTrip({
      tripNumber: "TRIP-B",
      driver: new mongoose.Types.ObjectId(driverId),
      truck: new mongoose.Types.ObjectId(), // Different truck
      startLocation: "C",
      endLocation: "D",
      scheduledDate: TRIP_DATE,
    });

    expect(result).rejects.toThrow("Resource conflict");
  });

  it("should fail to create a trip for the same truck on the same day", async () => {
    // Create another driver
    const driver2 = await User.create({
      name: "Driver 2",
      email: "d2@test.com",
      password: "p",
      role: "driver",
    });

    const result = TripService.createTrip({
      tripNumber: "TRIP-C",
      driver: driver2._id,
      truck: new mongoose.Types.ObjectId(truckId),
      startLocation: "C",
      endLocation: "D",
      scheduledDate: TRIP_DATE,
    });

    expect(result).rejects.toThrow("Resource conflict");
  });

  it("should succeed on a different day", async () => {
    const nextDay = new Date(TRIP_DATE);
    nextDay.setDate(nextDay.getDate() + 1);

    const trip = await TripService.createTrip({
      tripNumber: "TRIP-D",
      driver: new mongoose.Types.ObjectId(driverId),
      truck: new mongoose.Types.ObjectId(truckId),
      startLocation: "A",
      endLocation: "B",
      scheduledDate: nextDay,
    });

    expect(trip).toBeDefined();
    expect(trip.scheduledDate).toEqual(nextDay);
  });
});
