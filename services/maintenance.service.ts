import type { ITruck } from "../models/truck.model";
import Truck from "../models/truck.model";
import Trailer from "../models/trailer.model";
import MaintenanceLog from "../models/maintenanceLog.model";
import type { IMaintenanceLog } from "../models/maintenanceLog.model";

import MaintenanceConfigService from "./maintenanceConfig.service";

const MaintenanceService = {
  /**
   * Checks if a truck requires maintenance based on mileage and time.
   * Updates the truck's status and flags if maintenance is needed.
   */
  evaluateTruckHealth: async (truck: ITruck): Promise<void> => {
    const flags: string[] = [];
    let needsMaintenance = false;

    // 1. Check Mileage for Oil Change
    // If nextMaintenanceMileage is set, check if we've passed it.
    // If not set, we might assume it was just serviced or new.
    if (
      truck.nextMaintenanceMileage &&
      truck.currentMileage >= truck.nextMaintenanceMileage
    ) {
      flags.push("Oil Change Required");
      needsMaintenance = true;
    }

    // 1b. Check Mileage for Tire Rotation
    if (
      truck.nextTireRotationMileage &&
      truck.currentMileage >= truck.nextTireRotationMileage
    ) {
      flags.push("Tire Rotation Required");
      needsMaintenance = true;
    }

    // 2. Check Time for Inspection
    if (truck.lastMaintenanceDate) {
      const config = await MaintenanceConfigService.getConfig();
      const nextInspectionDate = new Date(truck.lastMaintenanceDate);
      nextInspectionDate.setMonth(
        nextInspectionDate.getMonth() + config.inspectionIntervalMonths,
      );

      if (new Date() >= nextInspectionDate) {
        flags.push("Annual Inspection Due");
        needsMaintenance = true;
      }
    }

    // Update Truck State
    if (needsMaintenance && truck.status === "available") {
      // Only flag if available (don't disrupt on_trip, handled at trip end)
      truck.status = "maintenance";
      truck.maintenanceFlags = flags;
      await truck.save();
    } else if (needsMaintenance && truck.status === "on_trip") {
      // Just update flags, will transition to maintenance after trip
      truck.maintenanceFlags = flags;
      await truck.save();
    }
  },

  /**
   * Resets maintenance counters after service is performed.
   */
  performMaintenance: async (
    vehicleId: string,
    notes: string,
  ): Promise<ITruck | any | null> => {
    let vehicle: any = await Truck.findById(vehicleId);
    let vehicleModel = "Truck";

    if (!vehicle) {
      vehicle = await Trailer.findById(vehicleId);
      vehicleModel = "Trailer";
    }

    if (!vehicle) return null;

    const now = new Date();
    const config = await MaintenanceConfigService.getConfig();

    vehicle.lastMaintenanceDate = now;

    // Only update mileage logic for Trucks
    if (vehicleModel === "Truck" && vehicle.currentMileage !== undefined) {
      vehicle.nextMaintenanceMileage =
        vehicle.currentMileage + config.oilChangeIntervalKm;

      // Also reset tire rotation if it was flagged or generally on maintenance
      vehicle.nextTireRotationMileage =
        vehicle.currentMileage + config.tireRotationIntervalKm;
    }

    // Clear flags and reset status
    vehicle.maintenanceFlags = [];
    vehicle.status = "available";

    // Create Log Entry
    await MaintenanceLog.create({
      vehicle: vehicle._id,
      vehicleModel: vehicleModel,
      description: notes,
      date: now,
      type: "repair",
      cost: 0,
    });

    return await vehicle.save();
  },

  /**
   * Logs a driver vehicle inspection (DVIR).
   * Does NOT reset maintenance counters, but can flag issues.
   */
  logInspection: async (
    vehicleId: string,
    vehicleModel: "Truck" | "Trailer",
    notes: string,
    status: "good" | "issues_found"
  ): Promise<IMaintenanceLog> => {

    // If issues found, maybe flag the vehicle?
    if (status === "issues_found") {
      if (vehicleModel === "Truck") {
        await Truck.findByIdAndUpdate(vehicleId, {
          $pull: { maintenanceFlags: "Driver Reported Issue" },
        });
        await Truck.findByIdAndUpdate(vehicleId, {
          $push: { maintenanceFlags: `Driver Reported Issue: ${notes}` },
        });
      } else if (vehicleModel === "Trailer") {
        await Trailer.findByIdAndUpdate(vehicleId, {
          $pull: { maintenanceFlags: "Driver Reported Issue" },
        });
        await Trailer.findByIdAndUpdate(vehicleId, {
          $push: { maintenanceFlags: `Driver Reported Issue: ${notes}` },
        });
      }

    }

    return await MaintenanceLog.create({
      vehicle: vehicleId,
      vehicleModel,
      description: `Driver Inspection: ${notes}`,
      date: new Date(),
      type: "inspection",
      cost: 0,
    });
  },

  /**
   * Retrieves maintenance history for a vehicle (or all if no ID provided)
   */
  getMaintenanceHistory: async (
    vehicleId?: string,
  ): Promise<IMaintenanceLog[]> => {
    const filter = vehicleId ? { vehicle: vehicleId } : {};
    return await MaintenanceLog.find(filter)
      .sort({ date: -1 })
      .populate("vehicle");
  },
};

export default MaintenanceService;
