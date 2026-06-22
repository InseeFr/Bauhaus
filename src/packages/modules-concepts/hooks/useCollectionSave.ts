import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { CollectionApi } from "@sdk/new-collection-api";

import { CollectionGeneral, CollectionMember } from "@model/concepts/collection";

import buildPayload, {
  CollectionMemberInput,
  CollectionPayloadInput,
} from "../utils/build-collection-payload";

export interface CollectionSaveData {
  general: CollectionGeneral;
  members: CollectionMember[] | CollectionMemberInput[];
}

export const useCollectionSave = (id: string | undefined) => {
  const isCreation = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const save = useCallback(
    (data: CollectionSaveData) => {
      setIsSaving(true);
      const payloadInput: CollectionPayloadInput = {
        general: data.general,
        members: data.members.map((m) => ({ id: m.id })),
      };
      const promise = isCreation
        ? CollectionApi.postCollection(buildPayload(payloadInput, "CREATE")).then((newId) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            navigate(`/concepts/collections/${newId}`);
          })
        : CollectionApi.putCollection(data.general.id, buildPayload(payloadInput, "UPDATE")).then(
            () => {
              queryClient.invalidateQueries({ queryKey: ["collections"] });
              queryClient.invalidateQueries({ queryKey: ["collection", id] });
              navigate(`/concepts/collections/${data.general.id}`);
            },
          );

      promise.catch(() => setIsSaving(false));
    },
    [id, isCreation, navigate, queryClient],
  );

  return { save, isSaving };
};
