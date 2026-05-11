import { useMutation } from "@tanstack/react-query";

import { CollectionExportApi, CollectionApi } from "@sdk/collection-api";

import { CollectionExportFormat } from "@model/concepts/collection";

import { saveFileFromHttpResponse } from "../files";
import { OPEN_DOCUMENT_TEXT_MIME_TYPE } from "../../sdk/constants";

interface ExportInput {
  ids: string[];
  type: CollectionExportFormat;
  lang: "lg1" | "lg2";
  withConcepts: boolean;
}

export const useCollectionExporter = () => {
  return useMutation<unknown, Error, ExportInput>({
    mutationFn: ({ ids, type, lang, withConcepts }) => {
      const api: CollectionExportApi = CollectionApi;
      const promise =
        ids.length > 1
          ? api.getCollectionExportZipByType(ids, type, lang, withConcepts)
          : api.getCollectionExportByType(
              ids[0],
              OPEN_DOCUMENT_TEXT_MIME_TYPE,
              type,
              lang,
              withConcepts,
            );

      return promise.then(saveFileFromHttpResponse);
    },
  });
};
