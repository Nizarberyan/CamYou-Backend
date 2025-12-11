import { object, string, number, mixed, date } from "yup";

export const createTireSchema = object({
    body: object({
        serialNumber: string().required("Serial Number is required"),
        brand: string().required("Brand is required"),
        size: string().required("Size is required"),
        status: mixed()
            .oneOf(["in_use", "spare", "maintenance", "scrap"])
            .default("spare"),
        condition: mixed()
            .oneOf(["new", "good", "worn", "damaged"])
            .default("new"),
        treadDepth: number().required("Tread depth is required").min(0),
        purchaseDate: date(),
        assignedTo: string().nullable(),
        assignedToModel: mixed().oneOf(["Truck", "Trailer"]).nullable(),
        position: string().nullable(),
    }),
});

export const updateTireSchema = object({
    body: object({
        serialNumber: string(),
        brand: string(),
        size: string(),
        status: mixed().oneOf(["in_use", "spare", "maintenance", "scrap"]),
        condition: mixed().oneOf(["new", "good", "worn", "damaged"]),
        treadDepth: number().min(0),
        purchaseDate: date(),
        assignedTo: string().nullable(),
        assignedToModel: mixed().oneOf(["Truck", "Trailer"]).nullable(),
        position: string().nullable(),
    }),
});
