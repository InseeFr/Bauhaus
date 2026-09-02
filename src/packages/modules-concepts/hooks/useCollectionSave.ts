import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CollectionGeneral, CollectionMember } from "@model/concepts/collection";

import { CollectionApi } from "@sdk/new-collection-api";

import {
  buildCollectionPayload,
  CollectionMemberInput,
  CollectionPayloadInput,
} from "../utils/buildCollectionPayload";

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
        ? CollectionApi.postCollection(buildCollectionPayload(payloadInput, "CREATE")).then(
            (newId) => {
              queryClient.invalidateQueries({ queryKey: ["collections"] });
              navigate(`/concepts/collections/${newId}`);
            },
          )
        : CollectionApi.putCollection(
            data.general.id,
            buildCollectionPayload(payloadInput, "UPDATE"),
          ).then(() => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({ queryKey: ["collection", id] });
            navigate(`/concepts/collections/${data.general.id}`);
          });

      promise.catch(() => setIsSaving(false));
    },
    [id, isCreation, navigate, queryClient],
  );

  return { save, isSaving };
};
