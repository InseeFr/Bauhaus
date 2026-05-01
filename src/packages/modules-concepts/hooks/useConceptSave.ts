import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import buildPayloadCreation from "../utils/build-payload-creation-update/build-payload-creation";
import buildPayloadUpdate from "../utils/build-payload-creation-update/build-payload-update";
import { ConceptsApi } from "@sdk/concepts-api";

type ConceptPayload = { collections: string[] };

export const useConceptSave = (id: string | undefined) => {
  const isCreation = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>();

  const invalidateQueries = useCallback(
    (conceptToSave: ConceptPayload) => {
      queryClient.invalidateQueries({ queryKey: ["concepts"] });
      conceptToSave.collections.forEach((collectionId) =>
        queryClient.invalidateQueries({ queryKey: ["collection", collectionId] }),
      );
    },
    [queryClient],
  );

  const save = useCallback(
    (dataOrId: any, versioningType?: any, oldData?: any, data?: any) => {
      setIsSaving(true);
      setSaveError(undefined);

      const conceptToSave: ConceptPayload = isCreation
        ? buildPayloadCreation(dataOrId)
        : buildPayloadUpdate(versioningType, oldData, data);

      const [promise, redirect]: [Promise<any>, (result: any) => string] = isCreation
        ? [
            ConceptsApi.postConcept(conceptToSave).then((newId: string) => {
              invalidateQueries(conceptToSave);
              return newId;
            }),
            (newId: string) => `/concepts/${newId}`,
          ]
        : [
            ConceptsApi.putConcept(id, conceptToSave).then(() => {
              queryClient.invalidateQueries({ queryKey: ["concept", id] });
              invalidateQueries(conceptToSave);
            }),
            () => `/concepts/${id}`,
          ];

      promise
        .then((result) => navigate(redirect(result)))
        .catch((e: string) => {
          setIsSaving(false);
          setSaveError(e);
        });
    },
    [id, isCreation, invalidateQueries, navigate, queryClient],
  );

  return { save, isSaving, saveError };
};
