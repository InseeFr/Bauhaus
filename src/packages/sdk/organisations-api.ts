import { buildApi } from "./build-api";

const api = {
  getOrganisations: () => [""],
} as const;
export const OrganisationsApi = buildApi("organizations", api);
