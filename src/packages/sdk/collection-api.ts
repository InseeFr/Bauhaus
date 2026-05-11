import { CollectionExportFormat } from "@model/concepts/collection";

import { buildApi } from "./build-api";

const api = {
  getCollectionExportZipByType: (
    ids: string[],
    type: CollectionExportFormat,
    lang: "lg1" | "lg2" = "lg1",
    withConcepts = false,
  ) => [
    `export-zip/${ids.join("_AND_")}/${type}?langue=${lang}&withConcepts=${withConcepts}`,
    {
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "text/plain",
      },
    },
    (res: Response) => res,
  ],
  getCollectionExportByType: (
    id: string,
    MimeType: string,
    type: CollectionExportFormat,
    lang: "lg1" | "lg2" = "lg1",
    withConcepts = false,
  ) => [
    `${id}/export/${type}?langue=${lang}&withConcepts=${withConcepts}`,
    {
      headers: {
        Accept: MimeType,
        "Content-Type": "text/plain",
      },
    },
    (res: Response) => res,
  ],
};

export interface CollectionExportApi {
  getCollectionExportZipByType(
    ids: string[],
    type: CollectionExportFormat,
    lang?: "lg1" | "lg2",
    withConcepts?: boolean,
  ): Promise<Response>;
  getCollectionExportByType(
    id: string,
    MimeType: string,
    type: CollectionExportFormat,
    lang?: "lg1" | "lg2",
    withConcepts?: boolean,
  ): Promise<Response>;
}

export const CollectionApi = buildApi(
  "concepts/collections",
  api,
) as unknown as CollectionExportApi;
