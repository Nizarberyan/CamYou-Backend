import Trip, { type ITrip } from "../models/trip.model";
import Truck from "../models/truck.model";
import MaintenanceService from "./maintenance.service";

const TripService = {
  getAllTrips: async (filter: any = {}): Promise<ITrip[]> => {
    return await Trip.find(filter)
      .populate("driver", "name email")
      .populate("truck", "licensePlate brand")
      .populate("trailer", "licensePlate type");
  },

  checkConflicts: async (
    driverId: string,
    truckId: string,
    date: Date,
  ): Promise<void> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check for trips on the same day for Driver or Truck
    const conflictingTrip = await Trip.findOne({
      $or: [{ driver: driverId }, { truck: truckId }],
      status: { $in: ["planned", "in_progress"] },
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (conflictingTrip) {
      throw new Error(
        `Resource conflict: Driver or Truck is already booked on ${date.toDateString()} (Trip: ${conflictingTrip.tripNumber})`,
      );
    }

    // Also check if they are currently ON a trip that started previously but is still in progress (this is harder without end dates, so we stick to the daily rule + truck status check)
    // Actually, Truck model has status 'on_trip'. We should check that too.
    const truck = await Truck.findById(truckId);
    if (truck?.status === "on_trip") {
      // If we are scheduling for FUTURE, 'on_trip' might be irrelevant.
      // Only relevant if scheduling for TODAY.
      if (startOfDay <= new Date()) {
        throw new Error(
          "Truck is currently on a trip and cannot be scheduled for today.",
        );
      }
    }
  },

  createTrip: async (tripData: Partial<ITrip>): Promise<ITrip> => {
    if (!tripData.driver || !tripData.truck || !tripData.scheduledDate) {
      throw new Error("Missing required fields for conflict check");
    }
    await TripService.checkConflicts(
      tripData.driver.toString(),
      tripData.truck.toString(),
      tripData.scheduledDate,
    );

    return await Trip.create(tripData);
  },

  getTripById: async (id: string): Promise<ITrip | null> => {
    return await Trip.findById(id)
      .populate("driver", "name email")
      .populate("truck", "licensePlate brand")
      .populate("trailer", "licensePlate type");
  },

  updateTrip: async (
    id: string,
    updateData: Partial<ITrip>,
  ): Promise<ITrip | null> => {
    return await Trip.findByIdAndUpdate(id, updateData, { new: true })
      .populate("driver", "name email")
      .populate("truck", "licensePlate brand")
      .populate("trailer", "licensePlate type");
  },

  deleteTrip: async (id: string): Promise<ITrip | null> => {
    return await Trip.findByIdAndDelete(id);
  },

  updateStatus: async (
    id: string,
    status: "in_progress" | "completed" | "cancelled",
    data: { endMileage?: number; fuelAdded?: number; notes?: string },
  ): Promise<ITrip | null> => {
    const trip = await Trip.findById(id);
    if (!trip) throw new Error("Trip not found");

    if (status === "in_progress") {
      const truck = await Truck.findById(trip.truck);
      if (!truck) throw new Error("Truck not found");

      trip.status = "in_progress";
      trip.startDate = new Date();
      trip.startMileage = truck.currentMileage;
      await trip.save();

      truck.status = "on_trip";
      await truck.save();
    } else if (status === "completed") {
      if (!data.endMileage) throw new Error("End mileage required");
      if (trip.startMileage && data.endMileage < trip.startMileage) {
        throw new Error("End mileage cannot be less than start mileage");
      }

      trip.status = "completed";
      trip.endDate = new Date();
      trip.endMileage = data.endMileage;
      trip.fuelAdded = data.fuelAdded || 0;
      if (data.notes)
        trip.notes = (trip.notes ? trip.notes + "\n" : "") + data.notes;

      if (trip.startMileage) {
        trip.actualDistance = data.endMileage - trip.startMileage;
      }

      await trip.save();

      const truck = await Truck.findById(trip.truck);
      if (truck) {
        truck.currentMileage = data.endMileage;
        truck.status = "available";
        await truck.save();

        // Check for Maintenance
        await MaintenanceService.evaluateTruckHealth(truck);
      }
    } else if (status === "cancelled") {
      trip.status = "cancelled";
      await trip.save();

      const truck = await Truck.findById(trip.truck);
      if (truck && truck.status === "on_trip") {
        truck.status = "available";
        await truck.save();
      }
    }

    return trip;
  },
  addExpense: async (
    id: string,
    expense: {
      type: string;
      amount: number;
      description: string;
      date?: string;
    },
  ): Promise<ITrip | null> => {
    return await Trip.findByIdAndUpdate(
      id,
      {
        $push: {
          expenses: { ...expense, date: expense.date || new Date() },
        },
      },
      { new: true },
    );
  },
};

export default TripService;
