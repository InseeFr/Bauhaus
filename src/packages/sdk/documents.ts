import { buildApi } from "./build-api";

const api = {
  getDocumentsAndLinksList: () => [""],
};

export const DocumentsApi = buildApi("documents", api) as any;
