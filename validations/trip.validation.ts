import { object, string, number, date, mixed } from "yup";

export const createTripSchema = object({
  body: object({
    tripNumber: string().required("Trip number is required"),
    driver: string().required("Driver is required"),
    truck: string().required("Truck is required"),
    trailer: string().nullable(),
    startLocation: string().required("Start location is required"),
    endLocation: string().required("End location is required"),
    scheduledDate: date().required("Scheduled date is required"),
    estimatedDistance: number().min(0),
    notes: string(),
  }),
});

export const updateTripSchema = object({
  body: object({
    tripNumber: string(),
    driver: string(),
    truck: string(),
    trailer: string().nullable(),
    startLocation: string(),
    endLocation: string(),
    scheduledDate: date(),
    startDate: date(),
    endDate: date(),
    status: mixed().oneOf(["planned", "in_progress", "completed", "cancelled"]),
    estimatedDistance: number().min(0),
    actualDistance: number().min(0),
    startMileage: number().min(0),
    endMileage: number().min(0),
    fuelAdded: number().min(0),
    notes: string(),
  }),
});

export const tripStatusSchema = object({
  body: object({
    status: mixed().oneOf(["in_progress", "completed", "cancelled"]).required(),
    // For completing:
    endMileage: number().when("status", {
      is: "completed",
      then: (schema) =>
        schema.required("End mileage is required when completing a trip"),
      otherwise: (schema) => schema.notRequired(),
    }),
    fuelAdded: number(),
    notes: string(),
  }),
});
