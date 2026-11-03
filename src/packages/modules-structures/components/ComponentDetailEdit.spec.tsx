import { QueryClient } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/codelists-api";
import { StructureApi } from "@sdk/structure-api";

import { EMPTY_ARRAY } from "@utils/array-utils";

import { expectNoBootstrapClass } from "../../tests/bootstrap-classes.testing";
import { MEASURE_PROPERTY_TYPE } from "../constants/dsd-components";
import { XSD_CODE_LIST, XSD_DATE, XSD_FLOAT, XSD_STRING } from "../constants/xsd";
import { mutualizedComponentQuery, partialCodelistsQuery } from "../hooks/queries";
import { createStructuresWrapper, field, type } from "../render.testing";
import { ComponentDetailEdit } from "./ComponentDetailEdit";

vi.mock("@sdk/structure-api", () => ({
  StructureApi: { getMutualizedComponent: vi.fn() },
}));
vi.mock("@sdk/codelists-api", async () => {
  const { CodelistsApi } = (await import("../mocks.testing")).emptyCodelistsApi();
  return { CodelistsApi: { ...CodelistsApi, getCodelistCodes: vi.fn() } };
});
vi.mock("@sdk/stamps-api", async () => (await import("../mocks.testing")).emptyStampsApi());
vi.mock("@sdk/v2-api", () => ({ V2Api: { getStamps: vi.fn().mockResolvedValue([]) } }));
vi.mock("@sdk/organizations-api", () => ({
  OrganizationsApi: { getOrganizations: vi.fn().mockResolvedValue([]) },
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: ({ value }: { value?: string }) => <div>{`creator:${value ?? ""}`}</div>,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: ({ value }: { value?: string[] }) => (
    <div>{`contributor:${(value ?? []).join(",")}`}</div>
  ),
}));

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../mocks.testing")).usersHookWithCreatePrivilege(
    await importOriginal(),
    "STRUCTURE_COMPONENT",
  ),
);

const Wrapper = createStructuresWrapper();

const handleSave = vi.fn();
const handleBack = vi.fn();

const component = {
  id: "c1",
  identifiant: "c1",
  labelLg1: "Composante 1",
  labelLg2: "Component 1",
  type: "http://purl.org/linked-data/cube#DimensionProperty",
  contributor: ["DG75-L201"],
};

const concepts = [{ id: "concept1", label: "Concept 1" }];
const codelists = [{ id: "cl1", label: "Liste 1", notation: "CL_1" }];

const renderEdit = (props: Record<string, unknown> = {}, queryClient?: QueryClient) =>
  render(
    <ComponentDetailEdit
      attributes={EMPTY_ARRAY}
      serverSideError=""
      type={undefined}
      component={component}
      concepts={concepts}
      codelists={codelists}
      handleSave={handleSave}
      handleBack={handleBack}
      {...props}
    />,
    { wrapper: queryClient ? createStructuresWrapper({ queryClient }) : Wrapper },
  );

/** Client dont le cache, amorcé par le test, n'est jamais relu. */
const cachedQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

/** Liste de codes complète `cl1`, dont une liste partielle est proposée. */
const renderCodeListWithPartial = () => {
  vi.mocked(CodelistsApi.getPartialsByParent).mockResolvedValue([
    { id: "CL_1_PARTIAL", iri: "http://bauhaus/cl1partial", labelLg1: "Liste partielle" },
  ]);
  renderEdit({
    component: { ...component, range: XSD_CODE_LIST, fullCodeListValue: "cl1" },
  });
};

/** Mesure liée à un attribut textuel valant « valeur ». */
const renderMeasureWithAttribute = () => {
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
};

describe("ComponentDetailEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ne pose aucune classe Bootstrap sur une représentation numérique", () => {
    renderEdit({ component: { ...component, range: XSD_FLOAT } });
    expectNoBootstrapClass();
  });

  it("ne pose aucune classe Bootstrap sur une représentation textuelle", () => {
    renderEdit({ component: { ...component, range: XSD_STRING } });
    expectNoBootstrapClass();
  });

  it("ne pose aucune classe Bootstrap sur une représentation liste de codes", async () => {
    renderCodeListWithPartial();
    await screen.findByText(/partial/i, { selector: "label" });
    expectNoBootstrapClass();
  });

  it("ne pose aucune classe Bootstrap sur les attributs d'une mesure", async () => {
    renderMeasureWithAttribute();
    await screen.findByDisplayValue("valeur");
    expectNoBootstrapClass();
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

  describe("après un enregistrement refusé par la validation", () => {
    const renderRejected = () => {
      renderEdit({ component: { ...component, labelLg1: "", labelLg2: "" } });
      fireEvent.click(saveButton());
    };

    it("garde le bouton désactivé quand seul un champ facultatif est modifié", () => {
      renderRejected();

      type("altLabelLg1", "Nom court");

      expect(saveButton()).toBeDisabled();
    });

    it("garde le bouton désactivé tant qu'un champ requis reste vide", () => {
      renderRejected();

      type("labelLg1", "Composante");

      expect(saveButton()).toBeDisabled();
    });

    it("réactive le bouton dès que tous les champs requis sont remplis", () => {
      renderRejected();

      type("labelLg1", "Composante");
      type("labelLg2", "Component");

      expect(saveButton()).toBeEnabled();
    });

    it("met à jour les erreurs de champ à la saisie", () => {
      renderRejected();

      type("labelLg1", "Composante");

      expect(field("labelLg1")).not.toHaveAttribute("aria-invalid", "true");
      expect(field("labelLg2")).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("revient en arrière quand on annule", () => {
    renderEdit();

    fireEvent.click(screen.getByRole("button", { name: /cancel|annuler/i }));

    expect(handleBack).toHaveBeenCalled();
  });

  it("enregistre le type choisi pour une nouvelle composante", async () => {
    renderEdit({
      component: { identifiant: "c1", labelLg1: "Composante 1", labelLg2: "Component 1" },
    });

    // PrimeReact ne monte les options qu'à l'ouverture du Dropdown.
    const typeField = screen
      .getByText("Type", { selector: "label" })
      .closest(".bauhaus-form-group")!;
    fireEvent.click(typeField.querySelector(".p-dropdown-trigger")!);
    fireEvent.click(await screen.findByRole("option", { name: "Dimension", hidden: true }));
    expect(typeField.querySelector(".p-dropdown-label")).toHaveTextContent("Dimension");
    fireEvent.click(saveButton());

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({ type: "http://purl.org/linked-data/cube#DimensionProperty" }),
    );
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

  it("reprend les listes de codes partielles déjà en cache, sans les relire", async () => {
    const queryClient = cachedQueryClient();
    queryClient.setQueryData(partialCodelistsQuery().queryKey, [
      { uri: "http://bauhaus/partielle", labelLg1: "Partielle", id: "CL_P" },
    ]);
    renderEdit(
      {
        component: {
          ...component,
          range: XSD_CODE_LIST,
          fullCodeListValue: "http://bauhaus/partielle",
        },
      },
      queryClient,
    );

    await waitFor(() => expect(CodelistsApi.getPartialsByParent).toHaveBeenCalledWith("CL_P"));
    expect(CodelistsApi.getCodelistsPartial).not.toHaveBeenCalled();
  });

  it("propose les listes partielles de la liste complète choisie", async () => {
    renderCodeListWithPartial();

    await waitFor(() => expect(CodelistsApi.getPartialsByParent).toHaveBeenCalledWith("CL_1"));
  });

  it("affiche la valeur de l'attribut lié à une mesure", async () => {
    renderMeasureWithAttribute();

    await waitFor(() => expect(StructureApi.getMutualizedComponent).toHaveBeenCalledWith("a1"));
    expect(await screen.findByDisplayValue("valeur")).toBeInTheDocument();
  });

  it("reprend l'attribut lié déjà en cache, sans le relire", async () => {
    const queryClient = cachedQueryClient();
    queryClient.setQueryData(mutualizedComponentQuery("a1").queryKey, { range: XSD_STRING } as any);
    renderEdit(
      {
        component: {
          ...component,
          type: MEASURE_PROPERTY_TYPE,
          attribute_0: "http://bauhaus/attribut1",
          attributeValue_0: "valeur",
        },
        attributes: [{ id: "a1", iri: "http://bauhaus/attribut1", labelLg1: "Attribut 1" }],
      },
      queryClient,
    );

    expect(await screen.findByDisplayValue("valeur")).toBeInTheDocument();
    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
  });

  it("propose les codes de la liste d'un attribut lié", async () => {
    vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue({
      range: XSD_CODE_LIST,
      codeList: "cl1",
    });
    vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue({
      total: 1,
      page: 1,
      items: [{ iri: "http://bauhaus/code1", labelLg1: "Code 1" }],
    });
    renderEdit({
      component: {
        ...component,
        type: MEASURE_PROPERTY_TYPE,
        attribute_0: "http://bauhaus/attribut1",
      },
      attributes: [{ id: "a1", iri: "http://bauhaus/attribut1", labelLg1: "Attribut 1" }],
    });
    await waitFor(() => expect(CodelistsApi.getCodelistCodes).toHaveBeenCalledWith("CL_1", 1, 0));

    fireEvent.click(await screen.findByText("Value", { selector: ".p-dropdown-label" }));

    expect(await screen.findByRole("option", { name: "Code 1", hidden: true })).toBeInTheDocument();
  });

  describe("attributs liés à une mesure", () => {
    const measure = {
      ...component,
      type: MEASURE_PROPERTY_TYPE,
      attribute_0: "http://bauhaus/attribut1",
      attributeValue_0: "valeur",
    };
    const attributes = [{ id: "a1", iri: "http://bauhaus/attribut1", labelLg1: "Attribut 1" }];

    beforeEach(() => {
      vi.mocked(StructureApi.getMutualizedComponent).mockResolvedValue({ range: XSD_STRING });
    });

    it("propose une ligne vide pour lier un attribut de plus", async () => {
      renderEdit({ component: measure, attributes });

      expect(await screen.findByDisplayValue("valeur")).toBeInTheDocument();
      expect(screen.getAllByText(/^Attribut(e)?$/, { selector: "label" })).toHaveLength(2);
    });

    it("n'enregistre pas la ligne vide proposée", async () => {
      renderEdit({ component: measure, attributes });
      await screen.findByDisplayValue("valeur");

      fireEvent.click(saveButton());

      expect(handleSave).toHaveBeenCalledWith(
        expect.not.objectContaining({ attribute_1: expect.anything() }),
      );
      expect(handleSave).toHaveBeenCalledWith(
        expect.not.objectContaining({ attributeValue_1: expect.anything() }),
      );
    });

    it("enregistre l'attribut saisi dans la ligne proposée", async () => {
      renderEdit({
        component: measure,
        attributes: [
          ...attributes,
          { id: "a2", iri: "http://bauhaus/attribut2", labelLg1: "Attribut 2" },
        ],
      });
      await screen.findByDisplayValue("valeur");

      // PrimeReact ne monte les options qu'à l'ouverture du Dropdown.
      const emptyRow = screen
        .getAllByText(/^Attribut(e)?$/, { selector: "label" })[1]
        .closest(".bauhaus-form-group")!;
      fireEvent.click(emptyRow.querySelector(".p-dropdown-trigger")!);
      fireEvent.click(await screen.findByRole("option", { name: "Attribut 2", hidden: true }));
      const valueFields = () => screen.getAllByLabelText(/^(Saisissez du texte|Insert text)$/);
      await waitFor(() => expect(valueFields()).toHaveLength(2));
      fireEvent.change(valueFields()[1], { target: { value: "autre valeur" } });
      fireEvent.click(saveButton());

      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          attribute_1: "http://bauhaus/attribut2",
          attributeValue_1: "autre valeur",
        }),
      );
    });
  });
});
