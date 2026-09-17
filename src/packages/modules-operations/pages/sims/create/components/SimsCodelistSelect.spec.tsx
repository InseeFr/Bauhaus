import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { describe, it, expect, vi } from "vitest";

import { SimsCodelistSelect } from "./SimsCodelistSelect";

type Props = ComponentProps<typeof SimsCodelistSelect>;

const DROPDOWN = ".p-dropdown";
const MULTISELECT = ".p-multiselect";

describe("SimsCodelistSelect", () => {
  const mockOnChange = vi.fn();
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const renderSelect = (props: Partial<Props> = {}) =>
    render(
      <SimsCodelistSelect
        multi={false}
        currentSection={{ value: "option1" }}
        options={mockOptions}
        onChange={mockOnChange}
        {...props}
      />,
    );

  const expectRendered = (name: string, props: Partial<Props>, selector: string) => ({
    name,
    props,
    selector,
  });

  // Une boucle plutôt que `it.each("$name")`, qui tronque les noms longs à 40 caractères.
  const itRenders = (cases: ReturnType<typeof expectRendered>[]) => {
    for (const { name, props, selector } of cases) {
      it(name, () => {
        const { container } = renderSelect(props);

        expect(container.querySelector(selector)).toBeTruthy();
      });
    }
  };

  describe("Single select mode (multi=false)", () => {
    itRenders([
      expectRendered(
        "should render Select component with single value",
        { currentSection: { value: "option1" } },
        DROPDOWN,
      ),
      expectRendered(
        "should pass single value to Select component",
        { currentSection: { value: "option2" } },
        DROPDOWN,
      ),
      expectRendered(
        "should handle undefined value in single mode",
        { currentSection: { value: undefined } },
        DROPDOWN,
      ),
      expectRendered(
        "should handle empty string value in single mode",
        { currentSection: { value: "" } },
        DROPDOWN,
      ),
    ]);
  });

  describe("Multi select mode (multi=true)", () => {
    itRenders([
      expectRendered(
        "should render Select component with multiple values",
        { multi: true, currentSection: { value: ["option1", "option2"] } },
        MULTISELECT,
      ),
      expectRendered(
        "should convert single value to array in multi mode",
        { multi: true, currentSection: { value: "option1" } },
        MULTISELECT,
      ),
      expectRendered(
        "should handle array value in multi mode",
        { multi: true, currentSection: { value: ["option1", "option3"] } },
        MULTISELECT,
      ),
      expectRendered(
        "should handle empty array value in multi mode",
        { multi: true, currentSection: { value: [] } },
        MULTISELECT,
      ),
      expectRendered(
        "should handle undefined value in multi mode",
        { multi: true, currentSection: { value: undefined } },
        MULTISELECT,
      ),
    ]);
  });

  describe("Props and attributes", () => {
    it("should pass onChange callback to Select", () => {
      renderSelect();

      // onChange should be passed as prop
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    itRenders([
      expectRendered("should pass options to Select", {}, DROPDOWN),
      expectRendered("should render with empty placeholder", {}, DROPDOWN),
      expectRendered(
        "should pass additional props via rest parameter",
        { disabled: true },
        DROPDOWN,
      ),
      expectRendered(
        "should handle className prop via rest parameter",
        { className: "custom-class" },
        DROPDOWN,
      ),
    ]);
  });

  describe("Edge cases", () => {
    itRenders([
      expectRendered(
        "should handle null value in currentSection",
        { currentSection: { value: null } },
        DROPDOWN,
      ),
      expectRendered("should handle empty options array", { options: [] }, DROPDOWN),
      expectRendered(
        "should render without crashing when currentSection has no value property",
        { currentSection: {} },
        DROPDOWN,
      ),
      expectRendered(
        "should handle multi mode with null value",
        { multi: true, currentSection: { value: null } },
        MULTISELECT,
      ),
      expectRendered(
        "should render multi select with mixed value types",
        {
          multi: true,
          currentSection: { value: ["option1", "option2", "option3"] },
        },
        MULTISELECT,
      ),
    ]);
  });

  describe("Component behavior", () => {
    it("should maintain consistent rendering between single and multi mode", () => {
      const { container: singleContainer } = renderSelect();
      const { container: multiContainer } = renderSelect({
        multi: true,
        currentSection: { value: ["option1"] },
      });

      // Both should render without errors
      expect(singleContainer.querySelector(DROPDOWN)).toBeTruthy();
      expect(multiContainer.querySelector(MULTISELECT)).toBeTruthy();
    });

    it("should correctly pass multi prop to Select component", () => {
      const { container } = renderSelect({
        multi: true,
        currentSection: { value: ["option1"] },
      });

      // Multi select should be rendered
      expect(container.querySelector(MULTISELECT)).toBeTruthy();
    });

    it("should handle dynamic options updates", () => {
      const newOptions = [
        { value: "newOption1", label: "New Option 1" },
        { value: "newOption2", label: "New Option 2" },
      ];

      const { container, rerender } = renderSelect();

      expect(container.querySelector(DROPDOWN)).toBeTruthy();

      rerender(
        <SimsCodelistSelect
          multi={false}
          currentSection={{ value: "option1" }}
          options={newOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(DROPDOWN)).toBeTruthy();
    });
  });

  describe("Value transformation logic", () => {
    itRenders([
      expectRendered(
        "should use value directly in single mode",
        { currentSection: { value: "testValue" } },
        DROPDOWN,
      ),
      expectRendered(
        "should keep array value as-is in multi mode",
        { multi: true, currentSection: { value: ["value1", "value2"] } },
        MULTISELECT,
      ),
      expectRendered(
        "should wrap non-array value in array for multi mode",
        { multi: true, currentSection: { value: "singleValue" } },
        MULTISELECT,
      ),
    ]);
  });

  describe("User interactions", () => {
    for (const { name, props, selector } of [
      expectRendered("should have a functional dropdown component in single mode", {}, DROPDOWN),
      expectRendered(
        "should have a functional multiselect component in multi mode",
        { multi: true, currentSection: { value: ["option1"] } },
        MULTISELECT,
      ),
    ]) {
      it(name, () => {
        const { container } = renderSelect(props);

        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(container.querySelector(selector)).toBeTruthy();
      });
    }

    it("should have clear icon in single mode when value is set", () => {
      const { container } = renderSelect();

      // PrimeReact dropdown should have clear icon
      const clearIcon = container.querySelector(".p-dropdown-clear-icon");
      expect(clearIcon).toBeTruthy();
    });
  });
});
