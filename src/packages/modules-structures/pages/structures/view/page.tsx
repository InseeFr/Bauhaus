import { QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { Structure } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { EMPTY_ARRAY } from "@utils/array-utils";
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
  onDeleteError: (error: unknown) => void;
  serverSideError?: unknown;
}

export const StructureView = ({
  structure,
  publish,
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
      <Controls structure={structure} publish={publish} onDeleteError={onDeleteError} />
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

  const [publishing, setPublishing] = useState(false);

  const [serverSideError, setServerSideError] = useState<unknown>();

  const publish = () => {
    setPublishing(true);
    setServerSideError(undefined);
    return StructureApi.publishStructure(structure)
      .then(() => queryClient.invalidateQueries({ queryKey: structureQuery(id!).queryKey }))
      .catch((error: any) => {
        setServerSideError(error);
      })
      .finally(() => setPublishing(false));
  };

  if (publishing) {
    return <Loading />;
  }

  return (
    <StructureView
      structure={structure}
      publish={publish}
      onDeleteError={setServerSideError}
      serverSideError={serverSideError}
    />
  );
};
