import Tire, { type ITire } from "../models/tire.model";
import TireHistory, { type ITireHistory } from "../models/tireHistory.model";

const TireService = {
  createTire: async (tireData: Partial<ITire>): Promise<ITire> => {
    return await Tire.create(tireData);
  },

  getAllTires: async (filter: Record<string, unknown> = {}): Promise<ITire[]> => {
    return await Tire.find(filter).populate("assignedTo");
  },

  getTireById: async (id: string): Promise<ITire | null> => {
    return await Tire.findById(id).populate("assignedTo");
  },

  updateTire: async (
    id: string,
    updateData: Partial<ITire>,
  ): Promise<ITire | null> => {
    const tire = await Tire.findById(id);
    if (
      updateData.treadDepth !== undefined &&
      tire &&
      updateData.treadDepth !== tire.treadDepth
    ) {
      await TireHistory.create({
        tire: id,
        treadDepth: updateData.treadDepth,
        type: "inspection",
        notes: "Tread depth updated",
      });
    }

    return await Tire.findByIdAndUpdate(id, updateData, { new: true });
  },

  getTireHistory: async (id: string): Promise<ITireHistory[]> => {
    return await TireHistory.find({ tire: id }).sort({ date: -1 });
  },

  deleteTire: async (id: string): Promise<ITire | null> => {
    return await Tire.findByIdAndDelete(id);
  },

  addHistoryEntry: async (
    id: string,
    data: { treadDepth: number; type: string; notes?: string; date?: Date },
  ): Promise<ITireHistory> => {
    // Also update the current tread depth of the tire if this is a newer inspection
    const tire = await Tire.findById(id);
    if (tire) {
      tire.treadDepth = data.treadDepth;
      await tire.save();
    }

    return await TireHistory.create({
      tire: id,
      treadDepth: data.treadDepth,
      type: data.type,
      notes: data.notes,
      date: data.date || new Date(),
    });
  },
};

export default TireService;
