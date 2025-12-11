import Trailer from "../models/trailer.model";
import { type InferType } from "yup";
import {
    type createTrailerSchema,
    type updateTrailerSchema,
} from "../validations/trailer.validation";

type CreateTrailerInput = InferType<typeof createTrailerSchema>["body"];
type UpdateTrailerInput = InferType<typeof updateTrailerSchema>["body"];

const TrailerService = {
    getTrailers: async () => {
        return await Trailer.find().populate("assignedTruck", "licensePlate vehicleModel");
    },

    getTrailerById: async (id: string) => {
        return await Trailer.findById(id).populate(
            "assignedTruck",
            "licensePlate vehicleModel",
        );
    },

    createTrailer: async (trailerData: CreateTrailerInput) => {
        const trailer = await Trailer.create(trailerData);
        return trailer;
    },

    updateTrailer: async (id: string, trailerData: UpdateTrailerInput) => {
        const trailer = await Trailer.findByIdAndUpdate(id, trailerData, {
            new: true,
            runValidators: true,
        }).populate("assignedTruck", "licensePlate vehicleModel");
        return trailer;
    },

    deleteTrailer: async (id: string) => {
        return await Trailer.findByIdAndDelete(id);
    },
};

export default TrailerService;
