import Truck from "../models/truck.model";
import { type InferType } from "yup";
import {
  type createTruckSchema,
  type updateTruckSchema,
} from "../validations/truck.validation";
import MaintenanceConfigService from "./maintenanceConfig.service";

type CreateTruckInput = InferType<typeof createTruckSchema>["body"];
type UpdateTruckInput = InferType<typeof updateTruckSchema>["body"];

const TruckService = {
  getTrucks: async () => {
    return await Truck.find().populate("assignedDriver", "name email");
  },

  getTruckById: async (id: string) => {
    return await Truck.findById(id).populate("assignedDriver", "name email");
  },

  createTruck: async (truckData: CreateTruckInput) => {
    const config = await MaintenanceConfigService.getConfig();

    // Initialize next maintenance milestones based on current mileage (or 0)
    const currentMileage = truckData.currentMileage || 0;

    const truckDetails = {
      ...truckData,
      nextMaintenanceMileage: currentMileage + config.oilChangeIntervalKm,
      nextTireRotationMileage: currentMileage + config.tireRotationIntervalKm,
    };

    const truck = await Truck.create(truckDetails);
    return truck;
  },

  updateTruck: async (id: string, truckData: UpdateTruckInput) => {
    const truck = await Truck.findByIdAndUpdate(id, truckData, {
      new: true,
      runValidators: true,
    }).populate("assignedDriver", "name email");
    return truck;
  },

  deleteTruck: async (id: string) => {
    return await Truck.findByIdAndDelete(id);
  },
};

export default TruckService;
