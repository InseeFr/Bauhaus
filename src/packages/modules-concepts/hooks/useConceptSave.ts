import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import buildPayloadCreation from "../utils/build-payload-creation-update/build-payload-creation";
import buildPayloadUpdate from "../utils/build-payload-creation-update/build-payload-update";
import { ConceptsApi } from "@sdk/concepts-api";

export const useConceptSave = (id: string | undefined) => {
  const isCreation = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    (dataOrId: any, versioningType?: any, oldData?: any, data?: any) => {
      setIsSaving(true);
      const [promise, redirect]: [Promise<any>, (result: any) => string] = isCreation
        ? [
            ConceptsApi.postConcept(buildPayloadCreation(dataOrId)).then((newId: string) => {
              queryClient.invalidateQueries({ queryKey: ["concepts"] });
              return newId;
            }),
            (newId: string) => `/concepts/${newId}`,
          ]
        : [
            ConceptsApi.putConcept(id, buildPayloadUpdate(versioningType, oldData, data)).then(
              () => {
                queryClient.invalidateQueries({ queryKey: ["concept", id] });
                queryClient.invalidateQueries({ queryKey: ["concepts"] });
              },
            ),
            () => `/concepts/${id}`,
          ];

      promise.then((result) => navigate(redirect(result))).catch(() => setIsSaving(false));
    },
    [id, isCreation, navigate, queryClient],
  );

  return { save, isSaving };
};
