import mongoose from "mongoose";
import User from "../models/user.model";
import Truck from "../models/truck.model";
import Trailer from "../models/trailer.model";
import connectDB from "../config/db";
import logger from "../config/logger";

const seedData = async () => {
    try {
        await connectDB();
        logger.info("Connected to MongoDB for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Truck.deleteMany({});
        await Trailer.deleteMany({});
        logger.info("Cleared existing data.");

        // Create Admin
        const admin = await User.create({
            name: "Admin User",
            email: "admin@camyou.com",
            password: "password123",
            role: "admin",
        });
        logger.info("Created Admin user.");

        // Create Drivers
        const driver1 = await User.create({
            name: "John Driver",
            email: "john@camyou.com",
            password: "password123",
            role: "driver",
            licenseNumber: "DL-12345",
            licenseExpiry: new Date("2025-12-31"),
        });

        const driver2 = await User.create({
            name: "Jane Driver",
            email: "jane@camyou.com",
            password: "password123",
            role: "driver",
            licenseNumber: "DL-67890",
            licenseExpiry: new Date("2026-06-30"),
        });
        logger.info("Created Drivers.");

        // Create Trucks
        const truck1 = await Truck.create({
            licensePlate: "TRUCK-001",
            brand: "Volvo",
            vehicleModel: "FH16",
            year: 2023,
            currentMileage: 15000,
            fuelType: "diesel",
            fuelCapacity: 600,
            status: "available",
            assignedDriver: driver1._id,
        });

        const truck2 = await Truck.create({
            licensePlate: "TRUCK-002",
            brand: "Mercedes",
            vehicleModel: "Actros",
            year: 2022,
            currentMileage: 45000,
            fuelType: "diesel",
            fuelCapacity: 550,
            status: "maintenance",
        });
        logger.info("Created Trucks.");

        // Create Trailers
        await Trailer.create({
            licensePlate: "TRAILER-001",
            type: "box",
            capacityWeight: 20000,
            brand: "Schmitz",
            year: 2023,
            status: "available",
            assignedTruck: truck1._id,
        });

        await Trailer.create({
            licensePlate: "TRAILER-002",
            type: "refrigerated",
            capacityWeight: 18000,
            brand: "Krone",
            year: 2021,
            status: "maintenance",
        });

        await Trailer.create({
            licensePlate: "TRAILER-003",
            type: "flatbed",
            capacityWeight: 25000,
            brand: "Schmitz",
            year: 2024,
            status: "available",
        });
        logger.info("Created Trailers.");

        logger.info("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        logger.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
