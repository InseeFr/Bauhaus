import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { CodelistsApi, StructureApi } from "@sdk/index";

import { AppContextProvider } from "../../application/app-context";
import {
  MEASURE_PROPERTY_TYPE,
  XSD_CODE_LIST,
  XSD_DATE,
  XSD_FLOAT,
  XSD_STRING,
} from "../constants";
import { ComponentDetailEdit } from "./ComponentDetailEdit";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
    getPartialsByParent: vi.fn().mockResolvedValue([]),
  },
  StructureApi: { getMutualizedComponent: vi.fn() },
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: ({ value }: { value?: string }) => <div>{`creator:${value ?? ""}`}</div>,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: ({ value }: { value?: string[] }) => (
    <div>{`contributor:${(value ?? []).join(",")}`}</div>
  ),
}));

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: () => ({
      privileges: [
        {
          application: "STRUCTURE_COMPONENT",
          privileges: [{ privilege: "CREATE", strategy: "ALL" }],
        },
      ],
    }),
    useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
  };
});

const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        {children}
      </AppContextProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

const handleSave = vi.fn();
const handleBack = vi.fn();

const component = {
  id: "c1",
  identifiant: "c1",
  labelLg1: "Composante 1",
  labelLg2: "Component 1",
  type: "http://purl.org/linked-data/cube#DimensionProperty",
  contributor: "DG75-L201",
};

const renderEdit = (props: Record<string, unknown> = {}) =>
  render(
    <ComponentDetailEdit
      attributes={[]}
      serverSideError=""
      type={undefined}
      component={component}
      concepts={[{ id: "concept1", label: "Concept 1" }]}
      codesLists={[{ id: "cl1", label: "Liste 1", notation: "CL_1" }]}
      handleSave={handleSave}
      handleBack={handleBack}
      {...props}
    />,
    { wrapper: Wrapper },
  );

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

describe("ComponentDetailEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la composante à modifier", () => {
    renderEdit();

    expect(screen.getByDisplayValue("Composante 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("c1")).toBeInTheDocument();
  });

  it("reporte la saisie de l'utilisateur", () => {
    renderEdit();

    fireEvent.change(screen.getByLabelText(/^Libellé/), {
      target: { name: "labelLg1", value: "Composante renommée" },
    });

    expect(screen.getByDisplayValue("Composante renommée")).toBeInTheDocument();
  });

  it("enregistre la composante complète", () => {
    renderEdit();

    fireEvent.click(saveButton());

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({ identifiant: "c1", labelLg1: "Composante 1" }),
    );
  });

  it("refuse d'enregistrer une composante incomplète et affiche les erreurs", async () => {
    renderEdit({ component: { ...component, labelLg2: "" } });

    fireEvent.click(saveButton());

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("revient en arrière quand on annule", () => {
    renderEdit();

    fireEvent.click(screen.getByRole("button", { name: /cancel|annuler/i }));

    expect(handleBack).toHaveBeenCalled();
  });

  it("propose un format et des longueurs pour une représentation textuelle", () => {
    renderEdit({ component: { ...component, range: XSD_STRING } });

    expect(screen.getByLabelText(/minimal length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximal length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/format/i)).toBeInTheDocument();
  });

  it("propose des bornes pour une représentation numérique", () => {
    renderEdit({ component: { ...component, range: XSD_FLOAT } });

    expect(screen.getByLabelText(/minimal value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximal value/i)).toBeInTheDocument();
  });

  it("propose un format pour une représentation date", () => {
    renderEdit({ component: { ...component, range: XSD_DATE } });

    fireEvent.change(screen.getByLabelText(/format/i), {
      target: { name: "pattern", value: "YYYY-MM-DD" },
    });

    expect(screen.getByDisplayValue("YYYY-MM-DD")).toBeInTheDocument();
  });

  it("charge les listes de codes partielles pour une représentation liste de codes", async () => {
    renderEdit({ component: { ...component, range: XSD_CODE_LIST } });

    await waitFor(() => expect(CodelistsApi.getCodelistsPartial).toHaveBeenCalled());
  });

  it("propose les listes partielles de la liste complète choisie", async () => {
    vi.mocked(CodelistsApi.getPartialsByParent).mockResolvedValue([
      { id: "CL_1_PARTIAL", iri: "http://bauhaus/cl1partial", labelLg1: "Liste partielle" },
    ]);
    renderEdit({
      component: { ...component, range: XSD_CODE_LIST, fullCodeListValue: "cl1" },
    });

    await waitFor(() => expect(CodelistsApi.getPartialsByParent).toHaveBeenCalledWith("CL_1"));
  });

  it("affiche la valeur de l'attribut lié à une mesure", async () => {
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue({ range: XSD_STRING });
    renderEdit({
      component: {
        ...component,
        type: MEASURE_PROPERTY_TYPE,
        attribute_0: "http://bauhaus/attribut1",
        attributeValue_0: "valeur",
      },
      attributes: [{ id: "a1", iri: "http://bauhaus/attribut1", labelLg1: "Attribut 1" }],
    });

    await waitFor(() => expect(StructureApi.getMutualizedComponent).toHaveBeenCalledWith("a1"));
    expect(await screen.findByDisplayValue("valeur")).toBeInTheDocument();
  });
});
