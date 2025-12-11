import * as yup from "yup";

export const createTrailerSchema = yup.object({
    body: yup.object({
        licensePlate: yup.string().required("License plate is required"),
        type: yup
            .string()
            .oneOf(["flatbed", "refrigerated", "box", "tanker", "other"])
            .default("box"),
        capacityWeight: yup.number().required("Capacity weight is required"),
        capacityVolume: yup.number(),
        brand: yup.string().required("Brand is required"),
        year: yup.number().required("Year is required"),
        vin: yup.string(),
        dimensions: yup.object({
            length: yup.number(),
            width: yup.number(),
            height: yup.number(),
        }),
        status: yup
            .string()
            .oneOf(["available", "on_trip", "maintenance", "inactive"])
            .default("available"),
        assignedTruck: yup.string(),
        lastMaintenanceDate: yup.date(),
        nextMaintenanceDate: yup.date(),
    }),
});

export const updateTrailerSchema = yup.object({
    body: yup.object({
        licensePlate: yup.string(),
        type: yup.string().oneOf(["flatbed", "refrigerated", "box", "tanker", "other"]),
        capacityWeight: yup.number(),
        capacityVolume: yup.number(),
        brand: yup.string(),
        year: yup.number(),
        vin: yup.string(),
        dimensions: yup.object({
            length: yup.number(),
            width: yup.number(),
            height: yup.number(),
        }),
        status: yup.string().oneOf(["available", "on_trip", "maintenance", "inactive"]),
        assignedTruck: yup.string().nullable(),
        lastMaintenanceDate: yup.date(),
        nextMaintenanceDate: yup.date(),
    }),
});
