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

import { ComponentDefinition } from "@model/structures/Component";

import { ComponentSpecification, ComponentSpecificationForm } from "./ComponentSpecificationForm";

describe("ComponentSpecificationForm", () => {
  it("should render form inputs", async () => {
    const component = {
      component: {},
    };
    render(
      <ComponentSpecificationForm
        component={component as unknown as ComponentSpecification}
        structureComponents={[]}
        selectedComponent={{ component } as unknown as ComponentDefinition}
        onChange={vi.fn()}
      />,
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
      const component = {
        component: {},
      };
      const onChange = vi.fn();
      render(
        <ComponentSpecificationForm
          component={component as unknown as ComponentSpecification}
          structureComponents={[]}
          selectedComponent={{ component } as unknown as ComponentDefinition}
          onChange={onChange}
        />,
      );
      const input = await screen.findByLabelText(label);
      fireEvent.change(input, { target: { value: "value" } });
      expect(onChange).toHaveBeenCalledWith({
        [propertyName]: "value",
        component: {},
      });
    });
  });
});
