import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Trip from "../models/trip.model";
import Report from "../models/report.model";
import User from "../models/user.model";
import Truck from "../models/truck.model";
import ReportService from "../services/report.service";

describe("Report Service Tests", () => {
  const tripIds: string[] = [];
  const TEST_DATE = new Date("2023-11-01");

  beforeAll(async () => {
    if (!process.env.MONGO_TEST_URL) {
      throw new Error("MONGO_TEST_URL is not defined");
    }
    await mongoose.connect(process.env.MONGO_TEST_URL);
    await Trip.deleteMany({});
    await Report.deleteMany({});

    // Create dummy dependencies
    await User.deleteMany({});
    const user = await User.create({
      name: "D",
      email: "d@test.com",
      password: "p",
      role: "driver",
    });

    await Truck.deleteMany({});
    const truck = await Truck.create({
      licensePlate: "REP-TRK",
      brand: "B",
      vehicleModel: "M",
      year: 2020,
      fuelCapacity: 100,
    });

    // Create completed trips for the TEST_DATE
    const trip1 = await Trip.create({
      tripNumber: "REP-001",
      status: "completed",
      endDate: new Date("2023-11-01T10:00:00Z"),
      actualDistance: 100,
      fuelAdded: 20,
      scheduledDate: TEST_DATE,
      startLocation: "A",
      endLocation: "B",
      driver: user._id,
      truck: truck._id,
    });

    const trip2 = await Trip.create({
      tripNumber: "REP-002",
      status: "completed",
      endDate: new Date("2023-11-01T15:00:00Z"),
      actualDistance: 50,
      fuelAdded: 10,
      scheduledDate: TEST_DATE,
      startLocation: "A",
      endLocation: "B",
      driver: user._id,
      truck: truck._id,
    });

    // Trip on another day
    await Trip.create({
      tripNumber: "REP-003",
      status: "completed",
      endDate: new Date("2023-11-02T10:00:00Z"),
      actualDistance: 200,
      fuelAdded: 50,
      scheduledDate: new Date("2023-11-02"),
      startLocation: "A",
      endLocation: "B",
      driver: user._id,
      truck: truck._id,
    });

    // Active trip
    await Trip.create({
      tripNumber: "REP-004",
      status: "in_progress",
      startDate: new Date("2023-11-01T08:00:00Z"),
      scheduledDate: TEST_DATE,
      startLocation: "A",
      endLocation: "B",
      driver: user._id,
      truck: truck._id,
    });

    tripIds.push(trip1._id.toString(), trip2._id.toString());
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should generate a correct daily report", async () => {
    const report = await ReportService.generateDailyReport(TEST_DATE);

    expect(report).toBeDefined();
    // 2023-11-01: 100 + 50 = 150 miles
    expect(report.totalMiles).toBe(150);
    // 2023-11-01: 20 + 10 = 30 fuel
    expect(report.totalFuel).toBe(30);
    expect(report.completedTrips).toBe(2);
    // Active trips is a global count at the time of report generation
    expect(report.activeTrips).toBe(1);
  });

  it("should be idempotent (upsert)", async () => {
    // Run again
    const report = await ReportService.generateDailyReport(TEST_DATE);

    const reportsCount = await Report.countDocuments({
      date: new Date("2023-11-01T00:00:00.000Z"),
    });
    expect(reportsCount).toBe(1);
    expect(report.totalMiles).toBe(150);
  });
});
