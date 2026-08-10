import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { ConceptsApi } from "@sdk/concepts-api";

import { ConceptGeneral, ConceptNotes, Link } from "../../model/concepts/concept";
import buildPayloadCreation from "../utils/build-payload-creation";
import buildPayloadUpdate from "../utils/build-payload-update";

export interface ConceptSaveData {
  general: ConceptGeneral;
  notes: ConceptNotes;
  conceptsWithLinks: { id: string; typeOfLink: string; label?: string }[];
  equivalentLinks?: (Link & { urn: string })[];
}

interface ConceptPayload {
  collections: string[];
}

export type SaveFn = {
  (data: ConceptSaveData): void;
  (id: string, versioningType: string, oldData: ConceptSaveData, data: ConceptSaveData): void;
};

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

  const save = useCallback<SaveFn>(
    (
      dataOrId: ConceptSaveData | string,
      versioningType?: string,
      oldData?: ConceptSaveData,
      data?: ConceptSaveData,
    ) => {
      setIsSaving(true);
      setSaveError(undefined);

      const conceptToSave = (isCreation
        ? buildPayloadCreation(dataOrId as ConceptSaveData)
        : buildPayloadUpdate(versioningType!, oldData!, data!)) as unknown as ConceptPayload;

      const [promise, redirect]: [Promise<string | void>, (result: string | void) => string] =
        isCreation
          ? [
              ConceptsApi.postConcept(conceptToSave).then((newId: string) => {
                invalidateQueries(conceptToSave);
                return newId;
              }),
              (newId) => `/concepts/${newId as string}`,
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
