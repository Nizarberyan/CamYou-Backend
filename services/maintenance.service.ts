import type { ITruck } from "../models/truck.model";
import Truck from "../models/truck.model";

const MAINTENANCE_RULES = {
  OIL_CHANGE_INTERVAL_KM: 15000,
  INSPECTION_INTERVAL_MONTHS: 12,
  TIRE_ROTATION_Interval_KM: 20000,
};

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

    // 2. Check Time for Inspection
    if (truck.lastMaintenanceDate) {
      const nextInspectionDate = new Date(truck.lastMaintenanceDate);
      nextInspectionDate.setMonth(
        nextInspectionDate.getMonth() +
          MAINTENANCE_RULES.INSPECTION_INTERVAL_MONTHS,
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
    truckId: string,
    notes: string,
  ): Promise<ITruck | null> => {
    const truck = await Truck.findById(truckId);
    if (!truck) return null;

    const now = new Date();

    truck.lastMaintenanceDate = now;
    truck.nextMaintenanceMileage =
      truck.currentMileage + MAINTENANCE_RULES.OIL_CHANGE_INTERVAL_KM;

    // Clear flags and reset status
    truck.maintenanceFlags = [];
    truck.status = "available";

    return await truck.save();
  },
};

export default MaintenanceService;
