import { buildApi } from "./build-api";

export const api = {
  getStamps: () => [""],
} as const;

export const StampsApi = buildApi("stamps", api);
