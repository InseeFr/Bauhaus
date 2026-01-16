import { buildApi, generateGenericApiEndpoints } from "./build-api";
import indicatorApi from "./operations/indicator";
import operationsApi from "./operations/operation";
import seriesApi from "./operations/series";
import simsApi from "./operations/sims";

const api = {
  ...simsApi,
  ...indicatorApi,
  ...generateGenericApiEndpoints("families", "family"),
  ...seriesApi,
  ...operationsApi,

  getMetadataStructureList: () => ["metadataStructureDefinition"],
  getMetadataAttributesList: () => ["metadataAttributes"],

  getVarBookExport: (id: string, MimeType: string) => [
    `operation/${id}/variableBook`,
    {
      headers: {
        Accept: MimeType,
        "Content-Type": "text/plain",
      },
    },
    (res: Response) => res,
  ],
} as any;

export const OperationsApi = buildApi("operations", api) as any;
