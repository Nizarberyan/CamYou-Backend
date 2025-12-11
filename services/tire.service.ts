import Tire, { type ITire } from "../models/tire.model";

const TireService = {
    createTire: async (tireData: Partial<ITire>): Promise<ITire> => {
        return await Tire.create(tireData);
    },

    getAllTires: async (filter: any = {}): Promise<ITire[]> => {
        return await Tire.find(filter).populate("assignedTo");
    },

    getTireById: async (id: string): Promise<ITire | null> => {
        return await Tire.findById(id).populate("assignedTo");
    },

    updateTire: async (id: string, updateData: Partial<ITire>): Promise<ITire | null> => {
        return await Tire.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteTire: async (id: string): Promise<ITire | null> => {
        return await Tire.findByIdAndDelete(id);
    },
};

export default TireService;
