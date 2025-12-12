import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Trip from "../models/trip.model";
import User from "../models/user.model";
import Truck from "../models/truck.model";
import Trailer from "../models/trailer.model";

const TEST_DB_URI =
  process.env.MONGO_TEST_URL || "mongodb://localhost:27017/camyou_test";

describe("Trip Management Tests", () => {
  let driverId: string;
  let truckId: string;
  let trailerId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    }

    // Setup dependencies
    const driver = await User.create({
      name: "Test Driver",
      email: "driver@test.com",
      password: "password123",
      role: "driver",
      licenseNumber: "DL-123",
      licenseExpiry: new Date(),
    });
    driverId = driver._id.toString();

    const truck = await Truck.create({
      licensePlate: "TRK-TRIP-01",
      brand: "Volvo",
      vehicleModel: "FH16",
      year: 2023,
      fuelCapacity: 500,
      fuelType: "diesel",
    });
    truckId = truck._id.toString();

    const trailer = await Trailer.create({
      licensePlate: "TRL-TRIP-01",
      type: "refrigerated",
      capacityWeight: 20000,
      brand: "Schmitz",
      year: 2023,
    });
    trailerId = trailer._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a Trip successfully", async () => {
    const tripData = {
      tripNumber: "TRIP-001",
      driver: driverId,
      truck: truckId,
      trailer: trailerId,
      startLocation: "Berlin",
      endLocation: "Munich",
      scheduledDate: new Date(),
      estimatedDistance: 580,
      notes: "Express delivery",
    };

    const trip = await Trip.create(tripData);
    expect(trip.tripNumber).toBe(tripData.tripNumber);
    expect(trip.status).toBe("planned");
    expect(trip.driver.toString()).toBe(driverId);
    expect(trip.truck.toString()).toBe(truckId);
  });

  it("should populate trip references", async () => {
    const trip = await Trip.findOne({ tripNumber: "TRIP-001" })
      .populate("driver")
      .populate("truck")
      .populate("trailer");

    expect(trip).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((trip?.driver as any).name).toBe("Test Driver");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((trip?.truck as any).licensePlate).toBe("TRK-TRIP-01");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((trip?.trailer as any).licensePlate).toBe("TRL-TRIP-01");
  });
  it("should start a trip and update truck status", async () => {
    const trip = await Trip.findOne({ tripNumber: "TRIP-001" });
    const truck = await Truck.findById(trip?.truck);
    expect(truck?.status).toBe("available");

    if (trip && truck) {
      trip.status = "in_progress";
      trip.startDate = new Date();
      trip.startMileage = truck.currentMileage; // 0
      await trip.save();

      truck.status = "on_trip";
      await truck.save();
    }

    const updatedTrip = await Trip.findOne({ tripNumber: "TRIP-001" });
    const updatedTruck = await Truck.findOne({ licensePlate: "TRK-TRIP-01" });

    expect(updatedTrip?.status).toBe("in_progress");
    expect(updatedTrip?.startMileage).toBe(0);
    expect(updatedTruck?.status).toBe("on_trip");
  });

  it("should complete a trip and update mileages", async () => {
    const trip = await Trip.findOne({ tripNumber: "TRIP-001" });
    const endMileage = 600;

    if (trip) {
      trip.status = "completed";
      trip.endMileage = endMileage;
      trip.fuelAdded = 50;

      if (trip.startMileage !== undefined) {
        trip.actualDistance = endMileage - trip.startMileage;
      }
      await trip.save();

      const truck = await Truck.findById(trip.truck);
      if (truck) {
        truck.currentMileage = endMileage;
        truck.status = "available";
        await truck.save();
      }
    }

    const completedTrip = await Trip.findOne({ tripNumber: "TRIP-001" });
    const completedTruck = await Truck.findOne({ licensePlate: "TRK-TRIP-01" });

    expect(completedTrip?.status).toBe("completed");
    expect(completedTrip?.endMileage).toBe(600);
    expect(completedTrip?.actualDistance).toBe(600); // 600 - 0
    expect(completedTruck?.currentMileage).toBe(600);
    expect(completedTruck?.status).toBe("available");
  });
});
