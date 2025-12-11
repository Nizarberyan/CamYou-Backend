import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Tire from "../models/tire.model";
import Truck from "../models/truck.model";

const TEST_DB_URI =
    process.env.MONGO_TEST_URL || "mongodb://localhost:27017/camyou_test";

describe("Tire Management Tests", () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(TEST_DB_URI);
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should create a Tire successfully", async () => {
        const tireData = {
            serialNumber: "SN-12345678",
            brand: "Michelin",
            size: "295/80R22.5",
            treadDepth: 18,
            condition: "new",
        };

        const tire = await Tire.create(tireData);
        expect(tire.serialNumber).toBe(tireData.serialNumber);
        expect(tire.status).toBe("spare"); // Default value
        expect(tire.condition).toBe("new");
    });

    it("should fail to create a Tire with duplicate serial number", async () => {
        const tireData = {
            serialNumber: "SN-12345678", // Duplicate
            brand: "Bridgestone",
            size: "295/80R22.5",
            treadDepth: 15,
        };

        try {
            await Tire.create(tireData);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((error as any).code).toBe(11000);
        }
    });

    it("should assign a tire to a Truck", async () => {
        // Create a truck first
        const truck = await Truck.create({
            licensePlate: "TRK-TIRE-01",
            brand: "Scania",
            vehicleModel: "R450",
            year: 2022,
            fuelCapacity: 600,
            fuelType: "diesel",
        });

        const tire = await Tire.create({
            serialNumber: "SN-ASSIGNED-01",
            brand: "Goodyear",
            size: "315/80R22.5",
            treadDepth: 16,
            assignedTo: truck._id,
            assignedToModel: "Truck",
            position: "Front-Left",
            status: "in_use",
        });

        const foundTire = await Tire.findById(tire._id).populate("assignedTo");
        expect(foundTire?.assignedTo).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((foundTire?.assignedTo as any).licensePlate).toBe("TRK-TIRE-01");
        expect(foundTire?.assignedToModel).toBe("Truck");
    });
});
