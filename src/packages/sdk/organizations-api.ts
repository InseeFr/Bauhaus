import { buildApi } from "./build-api";

const api = {
  getOrganizations: () => [""],
} as const;

export const OrganizationsApi = buildApi("organizations", api);
