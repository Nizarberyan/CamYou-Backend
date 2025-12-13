import MaintenanceConfig from "../models/maintenanceConfig.model";
import type { IMaintenanceConfig } from "../models/maintenanceConfig.model";

const MaintenanceConfigService = {
  getConfig: async (): Promise<IMaintenanceConfig> => {
    let config = await MaintenanceConfig.findOne();
    if (!config) {
      config = await MaintenanceConfig.create({}); // Use defaults
    }
    return config;
  },

  updateConfig: async (
    updates: Partial<IMaintenanceConfig>,
  ): Promise<IMaintenanceConfig> => {
    let config = await MaintenanceConfig.findOne();
    if (!config) {
      config = await MaintenanceConfig.create(updates);
    } else {
      Object.assign(config, updates);
      await config.save();
    }
    return config;
  },
};

export default MaintenanceConfigService;
