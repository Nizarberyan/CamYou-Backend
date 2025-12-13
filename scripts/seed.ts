import mongoose from "mongoose";
import User from "../models/user.model";
import Truck from "../models/truck.model";
import Trailer from "../models/trailer.model";
import Trip from "../models/trip.model";
import Tire from "../models/tire.model";
import Report from "../models/report.model";
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
        await Trip.deleteMany({});
        await Tire.deleteMany({});
        await Report.deleteMany({}); // Clear reports
        logger.info("Cleared existing data.");

        // ... Create Admin, Users ... (Keep same)
        const admin = await User.create({
            name: "Admin User",
            email: "admin@camyou.com",
            password: "password123",
            role: "admin",
            status: "active",
        });
        logger.info("Created Admin user.");

        const driver1 = await User.create({
            name: "John Driver",
            email: "john@camyou.com",
            password: "password123",
            role: "driver",
            licenseNumber: "DL-12345",
            licenseExpiry: new Date("2025-12-31"),
            status: "active",
        });

        const driver2 = await User.create({
            name: "Jane Driver",
            email: "jane@camyou.com",
            password: "password123",
            role: "driver",
            licenseNumber: "DL-67890",
            licenseExpiry: new Date("2026-06-30"),
            status: "active",
        });
        logger.info("Created Drivers.");

        // Create Trucks with varying states
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
            nextMaintenanceMileage: 30000,
            lastMaintenanceDate: new Date("2024-01-01"),
        });

        // Truck needing maintenance due to mileage
        const truck2 = await Truck.create({
            licensePlate: "TRUCK-002",
            brand: "Mercedes",
            vehicleModel: "Actros",
            year: 2022,
            currentMileage: 46000,
            fuelType: "diesel",
            fuelCapacity: 550,
            status: "maintenance",
            nextMaintenanceMileage: 45000, // Exceeded
            lastMaintenanceDate: new Date("2024-05-15"),
            maintenanceFlags: ["Mileage limit exceeded"],
        });

        // Truck needing maintenance due to time
        const truck3 = await Truck.create({
            licensePlate: "TRUCK-003",
            brand: "Scania",
            vehicleModel: "R500",
            year: 2021,
            currentMileage: 85000,
            fuelType: "diesel",
            fuelCapacity: 700,
            status: "available", // Not yet flagged as 'maintenance' status but physically overdue
            nextMaintenanceMileage: 100000,
            lastMaintenanceDate: new Date("2023-01-01"), // > 1 year
            maintenanceFlags: ["Annual Inspection Due"],
        });

        logger.info("Created Trucks.");

        // ... Create Tires and Trailers ... (Simplified or Keep same)
        // Create Tires
        await Tire.create({
            serialNumber: "TIRE-001",
            brand: "Michelin",
            size: "295/80R22.5",
            status: "in_use",
            condition: "good",
            treadDepth: 12,
            assignedTo: truck1._id,
            assignedToModel: "Truck",
            position: "Front-Left",
        });

        await Tire.create({
            serialNumber: "TIRE-002",
            brand: "Michelin",
            size: "295/80R22.5",
            status: "in_use",
            condition: "good",
            treadDepth: 12,
            assignedTo: truck1._id,
            assignedToModel: "Truck",
            position: "Front-Right",
        });

        await Tire.create({
            serialNumber: "TIRE-SPARE-001",
            brand: "Bridgestone",
            size: "295/80R22.5",
            status: "spare",
            condition: "new",
            treadDepth: 16,
        });
        logger.info("Created Tires.");

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
            assignedTruck: truck2._id,
        });
        logger.info("Created Trailers.");

        // Create Historical Reports (Last 30 days)
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);

            // Generate some random stats
            const completedTrips = Math.floor(Math.random() * 5) + 1;
            const activeTrips = Math.floor(Math.random() * 3);
            const totalMiles = completedTrips * (Math.floor(Math.random() * 300) + 100);
            const totalFuel = Math.floor(totalMiles / 3.5); // approx mpg

            await Report.create({
                date,
                totalMiles,
                totalFuel,
                activeTrips,
                completedTrips,
            });
        }
        logger.info("Created Historical Reports.");

        // Create Trips
        await Trip.create({
            tripNumber: "TRIP-101",
            driver: driver1._id,
            truck: truck1._id,
            startLocation: "Paris",
            endLocation: "Lyon",
            scheduledDate: new Date(),
            estimatedDistance: 460,
            notes: "Urgent delivery, avoid toll roads if traffic is light.",
        });

        await Trip.create({
            tripNumber: "TRIP-102",
            driver: driver1._id,
            truck: truck1._id,
            startLocation: "Lyon",
            endLocation: "Marseille",
            scheduledDate: new Date(new Date().setDate(new Date().getDate() + 1)),
            estimatedDistance: 315,
            status: "planned",
        });

        // A completed trip
        await Trip.create({
            tripNumber: "TRIP-099",
            driver: driver2._id,
            truck: truck2._id,
            startLocation: "Bordeaux",
            endLocation: "Toulouse",
            scheduledDate: new Date(new Date().setDate(new Date().getDate() - 5)),
            startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
            endDate: new Date(new Date().setDate(new Date().getDate() - 4)),
            startMileage: 44000,
            endMileage: 44250,
            actualDistance: 250,
            status: "completed",
            fuelAdded: 60,
        });
        logger.info("Created Trips.");

        logger.info("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        logger.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
