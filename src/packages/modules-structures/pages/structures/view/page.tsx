import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { StructureApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { Structure } from "../../../../model/structures/Structure";
import { Controls } from "./components/Controls";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { DescriptionsPanel } from "./components/DescriptionsPanel";
import { GlobalInformationsPanel } from "./components/GlobalInformationsPanel";
import { EMPTY_ARRAY } from "@utils/array-utils";

interface StructureViewTypes {
  structure: Structure;
  publish: (id: string) => void;
  serverSideError?: string;
}

export const StructureView = ({ structure, publish, serverSideError }: StructureViewTypes) => {
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
      <Controls structure={structure} publish={publish} />
      <ErrorBloc error={serverSideError} />
      <GlobalInformationsPanel structure={structure} />
      <DescriptionsPanel descriptionLg1={descriptionLg1} descriptionLg2={descriptionLg2} />
      <ComponentsPanel componentDefinitions={componentDefinitions} />
    </>
  );
};

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [structure, setStructure] = useState<Structure>({} as Structure);

  const [loading, setLoading] = useState(true);

  const [serverSideError, setServerSideError] = useState<string | undefined>();

  useEffect(() => {
    StructureApi.getStructure(id)
      .then((res: Structure) => setStructure(res))
      .finally(() => setLoading(false));
  }, [id]);

  const publish = () => {
    setLoading(true);
    setServerSideError(undefined);
    return StructureApi.publishStructure(structure)
      .then(() => StructureApi.getStructure(structure.id))
      .then((structure: Structure) => setStructure(structure))
      .finally(() => setLoading(false))
      .catch((error: any) => {
        setServerSideError(error);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <StructureView structure={structure} publish={publish} serverSideError={serverSideError} />
  );
};
