import { fireEvent, render, screen } from "@testing-library/react";

// Mock partiel : `initReactI18next` doit rester réel, l'i18n du module est
// initialisé au chargement de son bootstrap.
vi.mock("react-i18next", async (importOriginal) => ({
  ...(await importOriginal()),
  useTranslation: () => ({
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "component.notation": "Notation",
          "component.label": "Libellé",
        },
        en: {
          "component.notation": "Notation",
          "component.label": "Label",
        },
      };
      const lng = options?.lng ?? "fr";
      return translations[lng]?.[key] ?? key;
    },
  }),
}));

import { QueryClient } from "@tanstack/react-query";

import { Component, ComponentDefinition } from "@model/structures/Component";

import { StructureApi } from "@sdk/structure-api";

import { expectNoBootstrapClass } from "../../tests/bootstrap-classes.testing";
import { ATTRIBUTE_PROPERTY_TYPE, MEASURE_PROPERTY_TYPE } from "../constants/dsd-components";
import { mutualizedComponentQuery } from "../hooks/queries";
import { createStructuresWrapper } from "../render.testing";
import { ComponentSpecification, ComponentSpecificationForm } from "./ComponentSpecificationForm";

vi.mock("@sdk/structure-api", () => ({ StructureApi: { getMutualizedComponent: vi.fn() } }));

// Rattachements proposés, lisibles sans ouvrir la liste déroulante.
vi.mock("@components/select-rmes", () => ({
  Select: ({ options }: { options: { label: string }[] }) => (
    <ul aria-label="rattachements">
      {options.map(({ label }) => (
        <li key={label}>{label}</li>
      ))}
    </ul>
  ),
}));

const wrapper = createStructuresWrapper();

const component = {
  component: {},
};
const SELECTED_COMPONENT = { component } as unknown as ComponentDefinition;
const NO_STRUCTURE_COMPONENTS: never[] = [];

describe("ComponentSpecificationForm", () => {
  it("ne pose aucune classe Bootstrap, champs d'un attribut compris", async () => {
    render(
      <ComponentSpecificationForm
        component={component as unknown as ComponentSpecification}
        structureComponents={NO_STRUCTURE_COMPONENTS}
        selectedComponent={
          { component: { type: ATTRIBUTE_PROPERTY_TYPE } } as unknown as ComponentDefinition
        }
        onChange={vi.fn()}
      />,
      { wrapper },
    );
    await screen.findByLabelText("Notation");
    expectNoBootstrapClass();
  });

  it("should render form inputs", async () => {
    render(
      <ComponentSpecificationForm
        component={component as unknown as ComponentSpecification}
        structureComponents={NO_STRUCTURE_COMPONENTS}
        selectedComponent={SELECTED_COMPONENT}
        onChange={vi.fn()}
      />,
      { wrapper },
    );
    await screen.findByLabelText("Notation");
    await screen.findByLabelText("Libellé");
    await screen.findByLabelText("Label");
  });

  [
    ["Notation", "notation"],
    ["Libellé", "labelLg1"],
    ["Label", "labelLg2"],
  ].forEach(([label, propertyName]) => {
    it(`should call onChange if the ${propertyName} changed`, async () => {
      const onChange = vi.fn();
      render(
        <ComponentSpecificationForm
          component={component as unknown as ComponentSpecification}
          structureComponents={NO_STRUCTURE_COMPONENTS}
          selectedComponent={SELECTED_COMPONENT}
          onChange={onChange}
        />,
        { wrapper },
      );
      const input = await screen.findByLabelText(label);
      fireEvent.change(input, { target: { value: "value" } });
      expect(onChange).toHaveBeenCalledWith({
        [propertyName]: "value",
        component: {},
      });
    });
  });

  it("propose les mesures de la structure, déjà en cache, comme rattachement d'un attribut", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
    queryClient.setQueryData(mutualizedComponentQuery("mes1").queryKey, {
      id: "mes1",
      labelLg1: "Mesure en cache",
    } as Component);
    render(
      <ComponentSpecificationForm
        component={component as unknown as ComponentSpecification}
        structureComponents={[
          { component: { id: "mes1", type: MEASURE_PROPERTY_TYPE } } as ComponentDefinition,
        ]}
        selectedComponent={
          { component: { type: ATTRIBUTE_PROPERTY_TYPE } } as unknown as ComponentDefinition
        }
        onChange={vi.fn()}
      />,
      { wrapper: createStructuresWrapper({ queryClient }) },
    );

    expect(await screen.findByText("Mesure en cache")).toBeInTheDocument();
    expect(StructureApi.getMutualizedComponent).not.toHaveBeenCalled();
  });
});
