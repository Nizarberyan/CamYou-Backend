import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import mongoose from "mongoose";
import Trailer from "../models/trailer.model";
import Truck from "../models/truck.model";

const TEST_DB_URI =
    process.env.MONGO_TEST_URL || "mongodb://localhost:27017/camyou_test";

describe("Trailer Management Tests", () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(TEST_DB_URI);
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should create a Trailer successfully", async () => {
        const trailerData = {
            licensePlate: "TRL-TEST-001",
            type: "refrigerated",
            capacityWeight: 20000,
            brand: "Schmitz",
            year: 2023,
        };

        const trailer = await Trailer.create(trailerData);
        expect(trailer.licensePlate).toBe(trailerData.licensePlate);
        expect(trailer.status).toBe("available");
        expect(trailer.type).toBe("refrigerated");
    });

    it("should fail to create a Trailer with duplicate license plate", async () => {
        const trailerData = {
            licensePlate: "TRL-TEST-001", // Same as above
            type: "box",
            capacityWeight: 15000,
            brand: "Krone",
            year: 2022,
        };

        try {
            await Trailer.create(trailerData);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((error as any).code).toBe(11000);
        }
    });

    it("should assign a truck to a Trailer", async () => {
        // Create a truck first
        const truck = await Truck.create({
            licensePlate: "TRK-FOR-TRL-01",
            brand: "Volvo",
            vehicleModel: "FH16",
            year: 2023,
            fuelCapacity: 500,
            fuelType: "diesel",
        });

        const trailer = await Trailer.create({
            licensePlate: "TRL-WITH-TRUCK",
            type: "flatbed",
            capacityWeight: 25000,
            brand: "Schmitz",
            year: 2024,
            assignedTruck: truck._id,
        });

        const foundTrailer = await Trailer.findById(trailer._id).populate(
            "assignedTruck",
        );
        expect(foundTrailer?.assignedTruck).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((foundTrailer?.assignedTruck as any).licensePlate).toBe(
            "TRK-FOR-TRL-01",
        );
    });
});
