import { ConceptsApi } from "@sdk/concepts-api";
import { useMutation } from "@tanstack/react-query";
import { saveFileFromHttpResponse } from "@utils/files";

export const useConceptExporter = () => {
  return useMutation({
    mutationFn: ({
      ids,
      type,
      lang,
      withConcepts,
    }: {
      ids: string[];
      type: string;
      lang: string;
      withConcepts: boolean;
    }) => {
      return ConceptsApi.getConceptExportZipType(ids, type, lang, withConcepts).then(
        saveFileFromHttpResponse,
      );
    },
  });
};
