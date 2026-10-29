import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { CodelistsApi, StructureApi } from "@sdk/index";

import { createQueryClient } from "../../application/query-client";
import { XSD_CODE_LIST, XSD_STRING } from "../constants/xsd";
import { MeasureAttributes } from "./MeasureAttributes";

vi.mock("@sdk/index", () => ({
  StructureApi: { getMutualizedComponent: vi.fn() },
  CodelistsApi: { getCodelist: vi.fn() },
}));

const attributes = [
  { id: "a1", iri: "http://attr/1", labelLg1: "Unité", range: XSD_STRING },
  { id: "a2", iri: "http://attr/2", labelLg1: "Statut", range: XSD_CODE_LIST, codeList: "cl1" },
  { id: "a3", iri: "http://attr/3", labelLg1: "Contrôle", range: XSD_CODE_LIST, codeList: "cl1" },
] as unknown as Component[];

const codelists = [{ id: "cl1", notation: "CL_STATUT" }] as unknown as Codelists;

const renderAttributes = (measure: Record<string, unknown>) =>
  render(
    <QueryClientProvider client={createQueryClient()}>
      <MeasureAttributes measure={measure} attributes={attributes} codelists={codelists} />
    </QueryClientProvider>,
  );

describe("MeasureAttributes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StructureApi).getMutualizedComponent.mockImplementation((id: string) =>
      Promise.resolve(attributes.find((a) => a.id === id)),
    );
    vi.mocked(CodelistsApi).getCodelist.mockResolvedValue({
      codes: [{ iri: "http://code/valide", labelLg1: "Valide" }],
    });
  });

  it("n'affiche que les propriétés d'attribut de la mesure", async () => {
    renderAttributes({
      id: "m1",
      labelLg1: "Mesure",
      attribute_1: "http://attr/1",
      attributeValue_1: "en euros",
    });

    expect(await screen.findByText(/Unité/)).toBeInTheDocument();
    expect(screen.queryByText(/Mesure/)).not.toBeInTheDocument();
  });

  it("affiche telle quelle la valeur d'un attribut libre", async () => {
    renderAttributes({ attribute_1: "http://attr/1", attributeValue_1: "en euros" });

    await waitFor(() => {
      expect(screen.getByRole("listitem")).toHaveTextContent("Unité: en euros");
    });
  });

  it("affiche le libellé du code pour un attribut adossé à une liste de codes", async () => {
    renderAttributes({ attribute_1: "http://attr/2", attributeValue_1: "http://code/valide" });

    await waitFor(() => {
      expect(screen.getByRole("listitem")).toHaveTextContent("Statut: Valide");
    });
    expect(vi.mocked(CodelistsApi).getCodelist).toHaveBeenCalledWith("CL_STATUT");
  });

  it("n'affiche rien tant que l'attribut n'est pas chargé", async () => {
    vi.mocked(StructureApi).getMutualizedComponent.mockReturnValue(new Promise(() => {}));

    renderAttributes({ attribute_1: "http://attr/1", attributeValue_1: "en euros" });

    expect(screen.getByRole("listitem")).toBeEmptyDOMElement();
  });

  it("n'affiche rien tant que la liste de codes n'est pas chargée", async () => {
    vi.mocked(CodelistsApi).getCodelist.mockReturnValue(new Promise(() => {}));

    renderAttributes({ attribute_1: "http://attr/2", attributeValue_1: "http://code/valide" });

    await waitFor(() => {
      expect(screen.getByRole("listitem")).toHaveTextContent("Statut:");
    });
    expect(screen.getByRole("listitem")).not.toHaveTextContent("Valide");
  });

  it("ne lit qu'une fois la liste de codes partagée par deux attributs", async () => {
    renderAttributes({
      attribute_1: "http://attr/2",
      attributeValue_1: "http://code/valide",
      attribute_2: "http://attr/3",
      attributeValue_2: "http://code/valide",
    });

    await waitFor(() => expect(screen.getAllByText(/: Valide/)).toHaveLength(2));
    expect(vi.mocked(CodelistsApi).getCodelist).toHaveBeenCalledOnce();
  });

  it("n'affiche aucun attribut quand la mesure n'en porte pas", () => {
    renderAttributes({ id: "m1", labelLg1: "Mesure" });

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
