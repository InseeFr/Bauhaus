import { buildApi } from "./build-api";

export const apiConfig = {
  getDisseminationStatus: () => [""],
};

export const DisseminationStatus = buildApi("disseminationStatus", apiConfig);
