import {
  QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, useParams } from "react-router";

import { Saving } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { PartialConcept } from "@model/concepts/concept";
import { Component as StructureComponent } from "@model/structures/Component";

import { saveComponent } from "@sdk/structures/saveComponent";

import { conceptListQuery } from "@utils/hooks/concepts";
import { STRUCTURES_KEY } from "@utils/hooks/structures";
import { useGoBack } from "@utils/hooks/useGoBack";

import { appQueryClient } from "../../../../application/query-client";
import { ComponentDetailEdit, ComponentFormState } from "../../../components/ComponentDetailEdit";
import { mutualizedAttributesQuery, mutualizedComponentQuery } from "../../../hooks/queries";
import { useFormattedCodelist } from "../../../hooks/useFormattedCodelist";

/**
 * Lance les lectures du formulaire pendant le téléchargement de la page, sans retenir la
 * navigation. À la création, aucune composante n'est lue.
 */
export const prefetchEditedComponent =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    if (params.id) void queryClient.prefetchQuery(mutualizedComponentQuery(params.id));
    void queryClient.prefetchQuery(mutualizedAttributesQuery());
    void queryClient.prefetchQuery(conceptListQuery());
    return null;
  };

export const loader = prefetchEditedComponent(appQueryClient);

const NEW_COMPONENT = {} as StructureComponent;

/** À la création, la page ne lit aucune composante : la même file de requêtes sert un objet vide. */
const newComponentQuery = queryOptions<StructureComponent>({
  queryKey: ["new-mutualized-component"],
  queryFn: () => NEW_COMPONENT,
  staleTime: Infinity,
});

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [{ data: component }, { data: attributes }, { data: concepts }] = useSuspenseQueries({
    queries: [
      id ? mutualizedComponentQuery(id) : newComponentQuery,
      mutualizedAttributesQuery(),
      conceptListQuery(),
    ],
  });

  return (
    <ComponentEdition
      key={id ?? "create"}
      initialComponent={component}
      attributes={attributes}
      concepts={concepts}
    />
  );
};

interface ComponentEditionTypes {
  initialComponent: StructureComponent;
  attributes: StructureComponent[];
  concepts: PartialConcept[];
}

/**
 * La composante lue au montage initialise le formulaire une fois pour toutes : une relecture en
 * arrière-plan (retour sur l'onglet, invalidation) ne doit pas écraser la saisie en cours.
 */
const ComponentEdition = ({
  initialComponent,
  attributes,
  concepts,
}: Readonly<ComponentEditionTypes>) => {
  const { t } = useTranslation();

  const goBack = useGoBack();

  const isEditing = !!initialComponent.id;

  const urlParams = new URLSearchParams(window.location.search);

  const type = urlParams.get("type");

  const { data: codelists = [] } = useFormattedCodelist();

  // Après un échec, le formulaire est remonté avec la saisie envoyée.
  const [component, setComponent] = useState<ComponentFormState>(initialComponent);
  const [serverSideError, setServerSideError] = useState<unknown>("");

  const handleBack = useCallback(() => goBack("/structures/components"), [goBack]);

  const queryClient = useQueryClient();

  /** Fiche et listes périmées avant le retour. Un échec s'affiche dans le formulaire. */
  const { mutate: handleSave, isPending: saving } = useMutation({
    mutationFn: (component: ComponentFormState) => saveComponent(component as StructureComponent),
    onMutate: () => setServerSideError(""),
    onSuccess: async (id, component) => {
      await queryClient.invalidateQueries({ queryKey: STRUCTURES_KEY, refetchType: "none" });
      goBack(`/structures/components/${id ?? component.id}`, !component.id);
    },
    onError: (error, component) => {
      setComponent(component);
      setServerSideError(error);
    },
  });

  if (saving) return <Saving />;

  return (
    <>
      {isEditing ? (
        <PageTitleBlock titleLg1={component.labelLg1} titleLg2={component.labelLg2} />
      ) : (
        <PageTitle title={t("component.creationPageTitle")} />
      )}
      <ComponentDetailEdit
        codelists={codelists}
        component={component}
        concepts={concepts}
        handleBack={handleBack}
        handleSave={handleSave}
        attributes={attributes}
        serverSideError={serverSideError}
        type={type === "ALL" || type === null ? undefined : type}
      />
    </>
  );
};
