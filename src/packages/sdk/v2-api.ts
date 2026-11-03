import { buildApi } from "./build-api";

const api = {
  getStamps: () => ["stamps"],
} as const;

export const V2Api = buildApi("v2", api);
