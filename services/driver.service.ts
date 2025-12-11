import User from "../models/user.model";
import type { InferType } from "yup";
import { createDriverSchema } from "../validations/driver.validation";

type DriverInput = InferType<typeof createDriverSchema>["body"];

const DriverService = {
  getDrivers: async () => {
    return await User.find({ role: "driver" });
  },

  getDriverById: async (id: string) => {
    return await User.findOne({ _id: id, role: "driver" });
  },

  createDriver: async (driverData: DriverInput) => {
    return await User.create({ ...driverData, role: "driver" });
  },

  updateDriver: async (id: string, driverData: Partial<DriverInput>) => {
    return await User.findOneAndUpdate(
      { _id: id, role: "driver" },
      driverData,
      {
        new: true,
      },
    );
  },

  deleteDriver: async (id: string) => {
    return await User.findOneAndDelete({ _id: id, role: "driver" });
  },
};

export default DriverService;
