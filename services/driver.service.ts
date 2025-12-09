import Driver from "../models/Driver.model";
import type { InferType } from "yup";
import { createDriverSchema } from "../validations/driver.validation";

type DriverInput = InferType<typeof createDriverSchema>["body"];

const DriverService = {
  getDrivers: async () => {
    return await Driver.find();
  },

  getDriverById: async (id: string) => {
    return await Driver.findById(id);
  },

  createDriver: async (driverData: DriverInput) => {
    return await Driver.create(driverData);
  },

  updateDriver: async (id: string, driverData: Partial<DriverInput>) => {
    return await Driver.findByIdAndUpdate(id, driverData, { new: true });
  },

  deleteDriver: async (id: string) => {
    return await Driver.findByIdAndDelete(id);
  },
};

export default DriverService;
