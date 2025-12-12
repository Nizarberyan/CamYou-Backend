import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Truck from "../models/truck.model";
import MaintenanceService from "../services/maintenance.service";

describe("Maintenance Service Tests", () => {
  let truckId: string;

  beforeAll(async () => {
    if (!process.env.MONGO_TEST_URL) {
      throw new Error("MONGO_TEST_URL is not defined");
    }
    await mongoose.connect(process.env.MONGO_TEST_URL);
    await Truck.deleteMany({});

    const truck = await Truck.create({
      licensePlate: "MAINT-TEST",
      brand: "Volvo",
      vehicleModel: "FH16",
      year: 2023,
      fuelCapacity: 600,
      currentMileage: 10000,
      nextMaintenanceMileage: 15000,
      lastMaintenanceDate: new Date("2023-01-01"),
      status: "available",
    });
    truckId = truck.id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should flag maintenance when mileage exceeded", async () => {
    const truck = await Truck.findById(truckId);
    if (!truck) throw new Error("Truck not found");

    truck.currentMileage = 16000; // > 15000
    await MaintenanceService.evaluateTruckHealth(truck);

    const updatedTruck = await Truck.findById(truckId);
    expect(updatedTruck?.status).toBe("maintenance");
    expect(updatedTruck?.maintenanceFlags).toContain("Oil Change Required");
    expect(updatedTruck?.maintenanceFlags).toContain("Annual Inspection Due"); // Since 2023-01-01 is > 12 months ago
  });

  it("should reset maintenance status after service", async () => {
    const truck = await MaintenanceService.performMaintenance(
      truckId,
      "Oil change done",
    );

    expect(truck?.status).toBe("available");
    expect(truck?.maintenanceFlags).toHaveLength(0);
    expect(truck?.nextMaintenanceMileage).toBeGreaterThan(16000);
  });
});
