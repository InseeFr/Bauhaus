import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { cleanId } from "@utils/string-utils";
import buildPayload from "../collections/utils/build-payload/build-payload";
import { CollectionApi } from "@sdk/new-collection-api";

export const useCollectionSave = (id: string | undefined) => {
  const isCreation = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    (data: any) => {
      setIsSaving(true);
      const promise = isCreation
        ? CollectionApi.postCollection(buildPayload(data, "CREATE")).then((newId: string) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            navigate(`/concepts/collections/${newId}`);
          })
        : CollectionApi.putCollection(data.general.id, buildPayload(data, "UPDATE")).then(() => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({ queryKey: ["collection", id] });
            navigate(`/concepts/collections/${cleanId(id)}`);
          });

      promise.finally(() => setIsSaving(false));
    },
    [id, isCreation, navigate, queryClient],
  );

  return { save, isSaving };
};
