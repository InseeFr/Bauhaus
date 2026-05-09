import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { CollectionApi } from "@sdk/new-collection-api";

import { cleanId } from "@utils/string-utils";

import { Collection } from "../../model/concepts/collection";
import buildPayload from "../utils/build-collection-payload";

interface CollectionSaveData {
  general: Collection;
  members: { id: string; label: string }[];
}

export const useCollectionSave = (id: string | undefined) => {
  const isCreation = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    (data: CollectionSaveData) => {
      setIsSaving(true);
      const promise = isCreation
        ? CollectionApi.postCollection(buildPayload(data, "CREATE")).then((newId: string) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            navigate(`/concepts/collections/${newId}`);
          })
        : CollectionApi.putCollection(data.general.id, buildPayload(data, "UPDATE")).then(() => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({ queryKey: ["collection", id] });
            navigate(`/concepts/collections/${cleanId(id!)}`);
          });

      promise.catch(() => setIsSaving(false));
    },
    [id, isCreation, navigate, queryClient],
  );

  return { save, isSaving };
};
