import { QueryClient, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { PageTitleBlock } from "@components/page-title-block";

import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/structure-api";

import { EMPTY_ARRAY } from "@utils/array-utils";
import { STRUCTURES_KEY } from "@utils/hooks/structures";
import { useTitle } from "@utils/hooks/useTitle";

import { appQueryClient } from "../../../../application/query-client";
import { structureQuery } from "../../../hooks/queries";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { Controls } from "./components/Controls";
import { DescriptionsPanel } from "./components/DescriptionsPanel";
import { GlobalInformationsPanel } from "./components/GlobalInformationsPanel";

interface StructureViewTypes {
  structure: Structure;
  publish: VoidFunction;
  isPublishing?: boolean;
  onDeleteError: (error: unknown) => void;
  serverSideError?: unknown;
}

export const StructureView = ({
  structure,
  publish,
  isPublishing = false,
  onDeleteError,
  serverSideError,
}: StructureViewTypes) => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), structure?.labelLg1);

  const {
    labelLg1,
    labelLg2,
    descriptionLg1,
    descriptionLg2,
    componentDefinitions = EMPTY_ARRAY,
  } = structure;

  return (
    <>
      <PageTitleBlock titleLg1={labelLg1} titleLg2={labelLg2} />
      <CheckSecondLang />
      <Controls
        structure={structure}
        publish={publish}
        isPublishing={isPublishing}
        onDeleteError={onDeleteError}
      />
      <ErrorBloc error={serverSideError} />
      <GlobalInformationsPanel structure={structure} />
      <DescriptionsPanel descriptionLg1={descriptionLg1} descriptionLg2={descriptionLg2} />
      <ComponentsPanel componentDefinitions={componentDefinitions} />
    </>
  );
};

/** Lance la lecture de la structure pendant le téléchargement de la page, sans retenir la navigation. */
export const prefetchStructure =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    void queryClient.prefetchQuery(structureQuery(params.id!));
    return null;
  };

export const loader = prefetchStructure(appQueryClient);

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();

  const { data: structure } = useSuspenseQuery(structureQuery(id!));

  const [serverSideError, setServerSideError] = useState<unknown>();

  /**
   * Le statut s'affiche sur la fiche et dans les listes : tout le préfixe est périmé, la fiche
   * affichée est relue avant la fin de la mutation. L'échec s'affiche sur la fiche.
   */
  const { mutate: publish, isPending: isPublishing } = useMutation({
    mutationFn: () => StructureApi.publishStructure(structure),
    onMutate: () => setServerSideError(undefined),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STRUCTURES_KEY }),
    onError: setServerSideError,
  });

  return (
    <StructureView
      structure={structure}
      publish={publish}
      isPublishing={isPublishing}
      onDeleteError={setServerSideError}
      serverSideError={serverSideError}
    />
  );
};
