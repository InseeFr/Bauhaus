import { fireEvent, render, screen } from "@testing-library/react";

import { ComponentSpecificationForm } from "./index";

describe("ComponentSpecificationForm", () => {
  it("should render form inputs", async () => {
    const component = {
      component: {},
    };
    render(
      <ComponentSpecificationForm
        component={component}
        structureComponents={[]}
        selectedComponent={{ component }}
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
          component={component}
          structureComponents={[]}
          selectedComponent={{ component }}
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
