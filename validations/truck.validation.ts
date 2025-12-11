import * as yup from "yup";

export const createTruckSchema = yup.object({
  body: yup.object({
    licensePlate: yup.string().required("License plate is required"),
    brand: yup.string().required("Brand is required"),
    vehicleModel: yup.string().required("Model is required"),
    year: yup
      .number()
      .required("Year is required")
      .min(1900)
      .max(new Date().getFullYear() + 1),
    vin: yup.string().optional(),
    currentMileage: yup.number().min(0).default(0),
    fuelType: yup
      .string()
      .oneOf(["diesel", "petrol", "electric", "hybrid"])
      .default("diesel"),
    fuelCapacity: yup.number().required("Fuel capacity is required").positive(),
    assignedDriver: yup.string().optional(),
    status: yup
      .string()
      .oneOf(["available", "on_trip", "maintenance", "inactive"])
      .default("available"),
    lastMaintenanceDate: yup.date().optional(),
    nextMaintenanceMileage: yup.number().optional().min(0),
    insuranceExpiry: yup.date().optional(),
    registrationExpiry: yup.date().optional(),
  }),
});

export const updateTruckSchema = yup.object({
  body: yup.object({
    licensePlate: yup.string(),
    brand: yup.string(),
    vehicleModel: yup.string(),
    year: yup
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    vin: yup.string(),
    currentMileage: yup.number().min(0),
    fuelType: yup.string().oneOf(["diesel", "petrol", "electric", "hybrid"]),
    fuelCapacity: yup.number().positive(),
    assignedDriver: yup.string(),
    status: yup
      .string()
      .oneOf(["available", "on_trip", "maintenance", "inactive"]),
    lastMaintenanceDate: yup.date(),
    nextMaintenanceMileage: yup.number().min(0),
    insuranceExpiry: yup.date(),
    registrationExpiry: yup.date(),
  }),
});
