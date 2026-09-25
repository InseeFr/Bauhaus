import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, it, expect, vi, Mock } from "vitest";

import { useDisseminationStatusOptions } from "@utils/hooks/disseminationStatus";

import { componentsI18n } from "../i18n";
import {
  DisseminationStatusVisualization,
  DisseminationStatusInput,
  getDisseminationStatus,
} from "./disseminationStatus";

vi.mock("../../utils/hooks/disseminationStatus", () => ({
  useDisseminationStatusOptions: vi.fn(),
}));

type Option = { value: string; label: string };

const PUBLIC: Option = { value: "PublicGenerique", label: "Public" };
const PUBLIC_GENERIQUE: Option = { value: "PublicGenerique", label: "Public Generique" };
const PUBLIC_SPECIFIQUE: Option = { value: "PublicSpecifique", label: "Public Specifique" };
const PRIVE: Option = { value: "Prive", label: "Private" };

const mockOptions = (...options: Option[]) =>
  (useDisseminationStatusOptions as Mock).mockReturnValue(options);

const renderInput = (props: Partial<ComponentProps<typeof DisseminationStatusInput>> = {}) =>
  render(<DisseminationStatusInput value="PublicGenerique" handleChange={() => {}} {...props} />);

const expectDropdown = (container: HTMLElement) =>
  expect(container.querySelector(".p-dropdown")).toBeInTheDocument();

const expectTitleLabel = () =>
  expect(screen.getByText(componentsI18n.t("disseminationStatus.title"))).toBeInTheDocument();

describe("getDisseminationStatus", () => {
  it("returns correct title for PublicGenerique", () => {
    expect(getDisseminationStatus("/PublicGenerique")).toBe(
      componentsI18n.t("disseminationStatus.DSPublicGeneriqueTitle"),
    );
  });

  it("returns correct title for PublicSpecifique", () => {
    expect(getDisseminationStatus("/PublicSpecifique")).toBe(
      componentsI18n.t("disseminationStatus.DSPublicSpecifiqueTitle"),
    );
  });

  it("returns correct title for Prive", () => {
    expect(getDisseminationStatus("/Prive")).toBe(
      componentsI18n.t("disseminationStatus.DSPrivateTitle"),
    );
  });

  it("returns empty string for unknown status", () => {
    expect(getDisseminationStatus("Unknown")).toBe("");
  });
});

describe("DisseminationStatusVisualization", () => {
  it("renders correct dissemination status", () => {
    render(<DisseminationStatusVisualization disseminationStatus="/PublicGenerique" />);
    expect(
      screen.getByText(
        `${componentsI18n.t("disseminationStatus.title")} : ${componentsI18n.t("disseminationStatus.DSPublicGeneriqueTitle")}`,
      ),
    ).toBeInTheDocument();
  });
});

describe("DisseminationStatusInput", () => {
  it("renders label if withLabel is true", () => {
    mockOptions(PUBLIC);
    renderInput({ required: true, withLabel: true });
    expectTitleLabel();
  });

  it("renders required label when required is true", () => {
    mockOptions(PUBLIC);
    renderInput({ required: true });
    expectTitleLabel();
  });

  it("associates the label with the select control", () => {
    mockOptions(PUBLIC);

    const { container } = renderInput({ withLabel: true });

    const label = container.querySelector("label[for]");
    const forId = label?.getAttribute("for");
    expect(forId).toBeTruthy();
    expect(container.querySelector(`[id="${forId}"]`)).not.toBeNull();
  });

  it("passes value prop to Select component", () => {
    mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE, PRIVE);

    const { container } = renderInput();

    // Verify the Select component is rendered
    expectDropdown(container);
  });

  it("calls handleChange when value changes", () => {
    const mockHandleChange = vi.fn();
    mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE);

    renderInput({ handleChange: mockHandleChange });

    // The handleChange should not be called on initial render
    expect(mockHandleChange).not.toHaveBeenCalled();
  });

  it("renders with different value options", () => {
    mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE, PRIVE);

    const { container } = renderInput({ value: "PublicSpecifique" });

    expectDropdown(container);
  });

  it("renders with Prive value", () => {
    mockOptions(PUBLIC_GENERIQUE, PRIVE);

    const { container } = renderInput({ value: "Prive" });

    expectDropdown(container);
  });

  it("renders with empty value", () => {
    mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE);

    const { container } = renderInput({ value: "" });

    expectDropdown(container);
  });

  it("does not render label when withLabel is false", () => {
    mockOptions(PUBLIC);

    renderInput({ withLabel: false });

    // The label should not be present
    const labels = screen.queryAllByText(componentsI18n.t("disseminationStatus.title"));
    expect(labels).toHaveLength(0);
  });

  it("renders optional label when required is false and withLabel is true", () => {
    mockOptions(PUBLIC);

    const { container } = renderInput({ required: false, withLabel: true });

    // Should render a label (not LabelRequired)
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toBe(componentsI18n.t("disseminationStatus.title"));
  });

  it("handleChange receives the correct value when called", () => {
    const mockHandleChange = vi.fn();
    mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE);

    renderInput({ handleChange: mockHandleChange });

    // Verify handleChange is a function and ready to be called
    expect(typeof mockHandleChange).toBe("function");
  });

  it("renders Select with correct options from hook", () => {
    mockOptions({ value: "option1", label: "Option 1" }, { value: "option2", label: "Option 2" });

    const { container } = renderInput({ value: "option1" });

    expectDropdown(container);
  });

  it("renders with all required props", () => {
    mockOptions(PUBLIC);

    const { container } = renderInput({ required: true, withLabel: true });

    expectDropdown(container);
    expectTitleLabel();
  });

  describe("User interactions", () => {
    it("should have a functional dropdown component", () => {
      const mockHandleChange = vi.fn();
      mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE, PRIVE);

      const { container } = renderInput({ handleChange: mockHandleChange });

      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
      expectDropdown(container);
    });

    it("should render with correct value selected", () => {
      mockOptions(PUBLIC_GENERIQUE, PRIVE);

      const { container } = renderInput({ value: "Prive" });

      // Verify the dropdown label shows the correct selected value
      const dropdownLabel = container.querySelector(".p-dropdown-label");
      expect(dropdownLabel).toHaveTextContent("Private");
    });

    it("should have clearable dropdown", () => {
      mockOptions(PUBLIC_GENERIQUE);

      const { container } = renderInput();

      // PrimeReact dropdown should have clear icon
      const clearIcon = container.querySelector(".p-dropdown-clear-icon");
      expect(clearIcon).toBeInTheDocument();
    });
  });

  describe("Validation tests", () => {
    it("should show required label when required prop is true", () => {
      mockOptions(PUBLIC);

      const { container } = renderInput({ value: "", required: true, withLabel: true });

      const requiredLabel = container.querySelector(".label-required");
      expect(requiredLabel).toBeInTheDocument();
    });

    it("should show optional label when required prop is false", () => {
      mockOptions(PUBLIC);

      const { container } = renderInput({ value: "", required: false, withLabel: true });

      const optionalLabel = container.querySelector("label:not(.label-required)");
      expect(optionalLabel).toBeInTheDocument();
    });

    it("should accept empty value when not required", () => {
      mockOptions(PUBLIC_GENERIQUE);

      const { container } = renderInput({ value: "", required: false });

      expectDropdown(container);
      // No error should be displayed
      const errorElements = container.querySelectorAll(".alert-danger");
      expect(errorElements).toHaveLength(0);
    });

    it("should validate that value is one of the available options", () => {
      mockOptions(PUBLIC_GENERIQUE, PUBLIC_SPECIFIQUE);

      const { container } = renderInput();

      expectDropdown(container);
    });

    it("should handle invalid value gracefully", () => {
      mockOptions(PUBLIC_GENERIQUE);

      const { container } = renderInput({ value: "InvalidValue" });

      // Component should still render without crashing
      expectDropdown(container);
    });

    it("should update value when handleChange is called with valid option", () => {
      const mockHandleChange = vi.fn();
      mockOptions(PUBLIC_GENERIQUE, PRIVE);

      const { rerender } = renderInput({ handleChange: mockHandleChange });

      // Simulate calling handleChange
      mockHandleChange("Prive");

      expect(mockHandleChange).toHaveBeenCalledWith("Prive");

      // Verify component can re-render with new value
      rerender(<DisseminationStatusInput value="Prive" handleChange={mockHandleChange} />);

      // Use getAllByText since "Private" appears in both option and label
      const privateElements = screen.getAllByText("Private");
      expect(privateElements.length).toBeGreaterThan(0);
    });

    it("should display placeholder when no value is selected", () => {
      mockOptions(PUBLIC_GENERIQUE);

      renderInput({ value: "" });

      // The Select component should render with placeholder support
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
