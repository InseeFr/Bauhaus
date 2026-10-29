import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { ActionToolbar } from "@components/action-toolbar";
import {
  DeleteButton,
  DuplicateButton,
  ReturnButton,
  UpdateButton,
} from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { Structure } from "@model/structures/Structure";
import { UNPUBLISHED } from "@model/ValidationState";

import { StructureApi } from "@sdk/structure-api";

import { STRUCTURES_KEY } from "@utils/hooks/structures";

import { HasAccess } from "../../../../../auth/components/auth";
import { structureQuery } from "../../../../hooks/queries";

interface ControlsTypes {
  structure: Structure;
  publish: VoidFunction;
  isPublishing?: boolean;
  onDeleteError: (error: unknown) => void;
}

export const Controls = ({
  structure,
  publish,
  isPublishing = false,
  onDeleteError,
}: ControlsTypes) => {
  const contributors = Array.isArray(structure.contributor)
    ? structure.contributor
    : [structure.contributor];

  const { id } = structure;

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  /**
   * La fiche supprimée sort du cache ; les listes sont seulement périmées, sans relecture
   * immédiate qui relirait aussi la fiche encore affichée (404). L'échec s'affiche sur la fiche, à
   * la place de celui d'une action précédente.
   */
  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: () => StructureApi.deleteStructure(id),
    onMutate: () => onDeleteError(undefined),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: structureQuery(id).queryKey });
      void queryClient.invalidateQueries({ queryKey: STRUCTURES_KEY, refetchType: "none" });
      return navigate("/structures");
    },
    onError: onDeleteError,
  });

  return (
    <ActionToolbar>
      <ReturnButton action="/structures" />
      <HasAccess module="STRUCTURE_STRUCTURE" privilege="PUBLISH" stamps={contributors}>
        <ValidationButton object={structure} callback={publish} disabled={isPublishing} />
      </HasAccess>
      <HasAccess module="STRUCTURE_STRUCTURE" privilege="CREATE" stamps={contributors}>
        <DuplicateButton action={`/structures/${id}/duplicate`} />
      </HasAccess>
      <HasAccess
        module="STRUCTURE_STRUCTURE"
        privilege="DELETE"
        complementaryCheck={structure.validationState === UNPUBLISHED}
        stamps={contributors}
      >
        <DeleteButton action={remove} disabled={isDeleting} />
      </HasAccess>
      <HasAccess
        module="STRUCTURE_STRUCTURE"
        privilege="UPDATE"
        complementaryCheck={structure.validationState === UNPUBLISHED}
        stamps={contributors}
      >
        <UpdateButton action={`/structures/${id}/update`} />
      </HasAccess>
    </ActionToolbar>
  );
};
