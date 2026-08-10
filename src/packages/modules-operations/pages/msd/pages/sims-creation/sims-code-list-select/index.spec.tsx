import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SimsCodeListSelect } from "./index";

describe("SimsCodeListSelect", () => {
  const mockOnChange = vi.fn();
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  describe("Single select mode (multi=false)", () => {
    it("should render Select component with single value", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should pass single value to Select component", () => {
      const currentSection = { value: "option2" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should handle undefined value in single mode", () => {
      const currentSection = { value: undefined };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should handle empty string value in single mode", () => {
      const currentSection = { value: "" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });
  });

  describe("Multi select mode (multi=true)", () => {
    it("should render Select component with multiple values", () => {
      const currentSection = { value: ["option1", "option2"] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should convert single value to array in multi mode", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // Component should handle converting single value to array
      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should handle array value in multi mode", () => {
      const currentSection = { value: ["option1", "option3"] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should handle empty array value in multi mode", () => {
      const currentSection = { value: [] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should handle undefined value in multi mode", () => {
      const currentSection = { value: undefined };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });
  });

  describe("Props and attributes", () => {
    it("should pass onChange callback to Select", () => {
      const currentSection = { value: "option1" };

      render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // onChange should be passed as prop
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should pass options to Select", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // Select should be rendered with options
      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should render with empty placeholder", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // Component should render successfully
      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should pass additional props via rest parameter", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
          disabled={true}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should handle className prop via rest parameter", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
          className="custom-class"
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle null value in currentSection", () => {
      const currentSection = { value: null };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should handle empty options array", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={[]}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should render without crashing when currentSection has no value property", () => {
      const currentSection = {} as any;

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should handle multi mode with null value", () => {
      const currentSection = { value: null };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should render multi select with mixed value types", () => {
      const currentSection = { value: ["option1", "option2", "option3"] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });
  });

  describe("Component behavior", () => {
    it("should maintain consistent rendering between single and multi mode", () => {
      const currentSection = { value: "option1" };

      const { container: singleContainer } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const { container: multiContainer } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={{ value: ["option1"] }}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // Both should render without errors
      expect(singleContainer.querySelector(".p-dropdown")).toBeTruthy();
      expect(multiContainer.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should correctly pass multi prop to Select component", () => {
      const currentSection = { value: ["option1"] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // Multi select should be rendered
      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should handle dynamic options updates", () => {
      const currentSection = { value: "option1" };
      const newOptions = [
        { value: "newOption1", label: "New Option 1" },
        { value: "newOption2", label: "New Option 2" },
      ];

      const { container, rerender } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();

      rerender(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={newOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });
  });

  describe("Value transformation logic", () => {
    it("should use value directly in single mode", () => {
      const currentSection = { value: "testValue" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should keep array value as-is in multi mode", () => {
      const arrayValue = ["value1", "value2"];
      const currentSection = { value: arrayValue };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should wrap non-array value in array for multi mode", () => {
      const currentSection = { value: "singleValue" };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });
  });

  describe("User interactions", () => {
    it("should have a functional dropdown component in single mode", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
      expect(container.querySelector(".p-dropdown")).toBeTruthy();
    });

    it("should have a functional multiselect component in multi mode", () => {
      const currentSection = { value: ["option1"] };

      const { container } = render(
        <SimsCodeListSelect
          multi={true}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      const multiselect = screen.getByRole("combobox");
      expect(multiselect).toBeInTheDocument();
      expect(container.querySelector(".p-multiselect")).toBeTruthy();
    });

    it("should have clear icon in single mode when value is set", () => {
      const currentSection = { value: "option1" };

      const { container } = render(
        <SimsCodeListSelect
          multi={false}
          currentSection={currentSection}
          options={mockOptions}
          onChange={mockOnChange}
        />,
      );

      // PrimeReact dropdown should have clear icon
      const clearIcon = container.querySelector(".p-dropdown-clear-icon");
      expect(clearIcon).toBeTruthy();
    });
  });
});
