import {
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { LoaderFunctionArgs, useParams } from "react-router";

import { StructureApi } from "@sdk/structure-api";

import { conceptListQuery } from "@utils/hooks/concepts";
import { useSecondLang } from "@utils/hooks/second-lang";
import { STRUCTURES_KEY } from "@utils/hooks/structures";
import { useGoBack } from "@utils/hooks/useGoBack";

import { appQueryClient } from "../../../../application/query-client";
import { ComponentDetailView } from "../../../components/ComponentDetailView";
import { ComponentTitle } from "../../../components/ComponentTitle";
import { mutualizedAttributesQuery, mutualizedComponentQuery } from "../../../hooks/queries";
import { useFormattedCodelist } from "../../../hooks/useFormattedCodelist";

/** Lance la lecture de la composante pendant le téléchargement de la page, sans retenir la navigation. */
export const prefetchMutualizedComponent =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    void queryClient.prefetchQuery(mutualizedComponentQuery(params.id!));
    void queryClient.prefetchQuery(mutualizedAttributesQuery());
    void queryClient.prefetchQuery(conceptListQuery());
    return null;
  };

export const loader = prefetchMutualizedComponent(appQueryClient);

export const Component = (props: any) => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const [{ data: component }, { data: attributes }, { data: concepts }] = useSuspenseQueries({
    queries: [mutualizedComponentQuery(id!), mutualizedAttributesQuery(), conceptListQuery()],
  });

  const { data: codelists = [] } = useFormattedCodelist();

  const [serverSideError, setServerSideError] = useState<unknown>();

  const handleBack = useCallback(() => goBack("/structures/components"), [goBack]);

  /**
   * La composante supprimée sort du cache ; les listes sont seulement périmées, sans relecture
   * immédiate qui relirait aussi la fiche encore affichée (404).
   */
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => StructureApi.deleteMutualizedComponent(id),
    onMutate: () => setServerSideError(undefined),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: mutualizedComponentQuery(id!).queryKey });
      await queryClient.invalidateQueries({ queryKey: STRUCTURES_KEY, refetchType: "none" });
      goBack("/structures/components");
    },
    onError: setServerSideError,
  });

  /**
   * Le statut s'affiche sur la fiche, dans les listes et dans les structures qui l'utilisent : tout
   * le préfixe est périmé, la fiche affichée est relue avant la fin de la mutation.
   */
  const { mutate: publishComponent, isPending: isPublishing } = useMutation({
    mutationFn: () => StructureApi.publishMutualizedComponent(component),
    onMutate: () => setServerSideError(undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STRUCTURES_KEY }),
    onError: setServerSideError,
  });

  return (
    <>
      <ComponentTitle component={component} />
      <ComponentDetailView
        {...props}
        col={2}
        codelists={codelists}
        component={component}
        concepts={concepts}
        handleBack={handleBack}
        handleDelete={handleDelete}
        handleUpdate={`/structures/components/${component.id}/modify`}
        mutualized={true}
        updatable={true}
        publishComponent={publishComponent}
        isPublishing={isPublishing}
        isDeleting={isDeleting}
        serverSideError={serverSideError}
        secondLang={secondLang}
        attributes={attributes}
      />
    </>
  );
};
