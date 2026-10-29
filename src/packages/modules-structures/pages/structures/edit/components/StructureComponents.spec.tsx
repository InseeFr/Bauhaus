import { QueryClient } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { Component } from "@model/structures/Component";

import { ConceptsApi } from "@sdk/concepts-api";
import { StructureApi } from "@sdk/structure-api";

import { expectNoBootstrapClass } from "../../../../../tests/bootstrap-classes.testing";
import { sdkRejection } from "../../../../../tests/sdk-rejection.testing";
import {
  ATTRIBUTE_PROPERTY_TYPE,
  DIMENSION_PROPERTY_TYPE,
  MEASURE_PROPERTY_TYPE,
} from "../../../../constants/dsd-components";
import { mutualizedComponentsQuery } from "../../../../hooks/queries";
import { createStructuresWrapper } from "../../../../render.testing";
import { StructureComponents } from "./StructureComponents";

vi.mock("react-i18next", async () =>
  (await import("../../../../mocks.testing")).translationKeysAsLabels(
    await vi.importActual("react-i18next"),
  ),
);

vi.mock("@sdk/concepts-api", () => ({
  ConceptsApi: { getConceptList: vi.fn() },
}));
vi.mock("@sdk/structure-api", () => ({
  StructureApi: { getMutualizedComponents: vi.fn() },
}));

vi.mock("../../../../hooks/useFormattedCodelist", () => ({
  useFormattedCodelist: () => ({ data: [{ id: "CL_1" }] }),
}));

vi.mock("../../../../components/ComponentSelector", () => ({
  ComponentSelector: ({
    type,
    concepts,
    mutualizedComponents,
    mutualizedComponentsError,
    codelists,
    structure,
  }: any) => (
    <div data-testid={type}>
      concepts:{concepts.length}|mutualisées:{mutualizedComponents.length}|listes:
      {codelists.length}|structure:{structure.id ?? "(aucune)"}
      {mutualizedComponentsError && `|erreur:${mutualizedComponentsError.message}`}
    </div>
  ),
}));

const onChange = vi.fn();
const NO_COMPONENT_DEFINITIONS: never[] = [];
const EDITED_STRUCTURE = { id: "str-1" };

const renderComponents = (props: Record<string, unknown> = {}, queryClient?: QueryClient) =>
  render(
    <StructureComponents
      componentDefinitions={NO_COMPONENT_DEFINITIONS}
      onChange={onChange}
      {...props}
    />,
    { wrapper: createStructuresWrapper({ queryClient }) },
  );

describe("StructureComponents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ConceptsApi.getConceptList).mockResolvedValue([{ id: "k-1" }, { id: "k-2" }]);
    vi.mocked(StructureApi.getMutualizedComponents).mockResolvedValue([{ id: "c-1" }]);
  });

  it("ne pose aucune classe Bootstrap", async () => {
    renderComponents();
    await waitFor(() => expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toBeInTheDocument());
    expectNoBootstrapClass();
  });

  it("propose un sélecteur par type de composante", async () => {
    renderComponents();

    await waitFor(() => expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toBeInTheDocument());
    expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toBeInTheDocument();
    expect(screen.getByTestId(ATTRIBUTE_PROPERTY_TYPE)).toBeInTheDocument();
  });

  it("alimente chaque sélecteur des mêmes référentiels", async () => {
    renderComponents();

    await waitFor(() =>
      expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toHaveTextContent(
        "concepts:2|mutualisées:1|listes:1",
      ),
    );
  });

  it("reprend les concepts et composantes mutualisées déjà en cache, sans les relire", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
    queryClient.setQueryData(["concepts"], [{ id: "k-1" }]);
    queryClient.setQueryData(mutualizedComponentsQuery().queryKey, [
      { id: "c-1" },
      { id: "c-2" },
    ] as Component[]);
    renderComponents({}, queryClient);

    expect(screen.getByTestId(DIMENSION_PROPERTY_TYPE)).toHaveTextContent(
      "concepts:1|mutualisées:2",
    );
    expect(ConceptsApi.getConceptList).not.toHaveBeenCalled();
    expect(StructureApi.getMutualizedComponents).not.toHaveBeenCalled();
  });

  it("part d'une structure vide quand aucune n'est fournie", async () => {
    renderComponents();

    await waitFor(() =>
      expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toHaveTextContent("structure:(aucune)"),
    );
  });

  it("transmet la structure en cours d'édition", async () => {
    renderComponents({ structure: EDITED_STRUCTURE });

    await waitFor(() =>
      expect(screen.getByTestId(MEASURE_PROPERTY_TYPE)).toHaveTextContent("structure:str-1"),
    );
  });

  it("transmet à chaque sélecteur l'échec du chargement des composantes mutualisées", async () => {
    vi.mocked(StructureApi.getMutualizedComponents).mockRejectedValue(
      sdkRejection.json(500, { message: "Le dépôt RDF est indisponible." }),
    );

    renderComponents();

    await waitFor(() =>
      expect(screen.getByTestId(ATTRIBUTE_PROPERTY_TYPE)).toHaveTextContent(
        "erreur:Le dépôt RDF est indisponible.",
      ),
    );
  });
});
