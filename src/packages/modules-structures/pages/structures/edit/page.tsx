import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useLocation, useParams } from "react-router";

import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { Structure } from "@model/structures/Structure";

import { useTitle } from "@utils/hooks/useTitle";

import { appQueryClient } from "../../../../application/query-client";
import { structureQuery } from "../../../hooks/queries";
import { EditionForm } from "./components/EditionForm";

/** Lance la lecture de la structure pendant le téléchargement de la page, sans retenir la navigation. */
export const prefetchEditedStructure =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    void queryClient.prefetchQuery(structureQuery(params.id!));
    return null;
  };

export const loader = prefetchEditedStructure(appQueryClient);

/** Copie d'une structure, sans identifiant pour qu'elle en obtienne un nouveau. */
const toDuplicate = (structure: Structure): Partial<Structure> => ({
  identifiant: structure.identifiant,
  labelLg1: structure.labelLg1,
  labelLg2: structure.labelLg2,
  id: "",
  creator: structure.creator,
  contributor: structure.contributor,
  disseminationStatus: structure.disseminationStatus,
  componentDefinitions: structure.componentDefinitions.map((cd: any) => {
    return {
      component: cd.component,
      order: cd.order,
      required: cd.required,
      attachment: cd.attachment,
    };
  }),
});

export const Component = () => {
  const location = useLocation();
  const duplicate = location.pathname.includes("/duplicate");

  const { id } = useParams();

  const { data: structure } = useSuspenseQuery(structureQuery(id!));

  return (
    <StructureEdition key={`${id}-${duplicate}`} structure={structure} duplicate={duplicate} />
  );
};

/**
 * La structure lue au montage initialise le formulaire une fois pour toutes : une relecture en
 * arrière-plan (retour sur l'onglet, invalidation) ne doit pas écraser la saisie en cours.
 */
const StructureEdition = ({
  structure,
  duplicate,
}: Readonly<{ structure: Structure; duplicate: boolean }>) => {
  const { t } = useTranslation();

  const [initialStructure] = useState(() => (duplicate ? toDuplicate(structure) : structure));

  useTitle(t("structure.pluralTitle"), initialStructure.labelLg1);

  if (duplicate) {
    return (
      <>
        <PageTitle title={t("structure.duplicationPageTitle") + `${initialStructure.labelLg1}`} />
        <EditionForm creation={duplicate} initialStructure={initialStructure} />
      </>
    );
  }

  return (
    <>
      <PageTitleBlock titleLg1={initialStructure.labelLg1} titleLg2={initialStructure.labelLg2} />
      <EditionForm creation={duplicate} initialStructure={initialStructure} />
    </>
  );
};
