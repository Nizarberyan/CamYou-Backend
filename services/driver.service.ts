import Driver from "../models/Driver.model";

const DriverService = {
    getDrivers: async () => {
        return await Driver.find();
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createDriver: async (driverData: any) => {
        return await Driver.create(driverData);
    }
};

export default DriverService;
