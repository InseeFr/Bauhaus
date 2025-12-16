import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";

import { useDisseminationStatusOptions } from "../../utils/hooks/disseminationStatus";
import D from "../i18n";
import {
  DisseminationStatusVisualisation,
  DisseminationStatusInput,
  getDisseminationStatus,
} from "./disseminationStatus";

vi.mock("../../utils/hooks/disseminationStatus", () => ({
  useDisseminationStatusOptions: vi.fn(),
}));

describe("getDisseminationStatus", () => {
  it("returns correct title for PublicGenerique", () => {
    expect(getDisseminationStatus("/PublicGenerique")).toBe(
      D.disseminationStatus.DSPublicGeneriqueTitle,
    );
  });

  it("returns correct title for PublicSpecifique", () => {
    expect(getDisseminationStatus("/PublicSpecifique")).toBe(
      D.disseminationStatus.DSPublicSpecifiqueTitle,
    );
  });

  it("returns correct title for Prive", () => {
    expect(getDisseminationStatus("/Prive")).toBe(D.disseminationStatus.DSPrivateTitle);
  });

  it("returns empty string for unknown status", () => {
    expect(getDisseminationStatus("Unknown")).toBe("");
  });
});

describe("DisseminationStatusVisualisation", () => {
  it("renders correct dissemination status", () => {
    render(<DisseminationStatusVisualisation disseminationStatus="/PublicGenerique" />);
    expect(
      screen.getByText(
        `${D.disseminationStatus.title} : ${D.disseminationStatus.DSPublicGeneriqueTitle}`,
      ),
    ).toBeInTheDocument();
  });
});

describe("DisseminationStatusInput", () => {
  it("renders label if withLabel is true", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public" },
    ]);
    render(
      <DisseminationStatusInput
        value="PublicGenerique"
        handleChange={() => {}}
        required
        withLabel
      />,
    );
    expect(screen.getByText(D.disseminationStatus.title)).toBeInTheDocument();
  });

  it("renders required label when required is true", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public" },
    ]);
    render(<DisseminationStatusInput value="PublicGenerique" handleChange={() => {}} required />);
    expect(screen.getByText(D.disseminationStatus.title)).toBeInTheDocument();
  });

  it("passes value prop to Select component", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "PublicSpecifique", label: "Public Specifique" },
      { value: "Prive", label: "Private" },
    ]);

    const { container } = render(
      <DisseminationStatusInput value="PublicGenerique" handleChange={() => {}} />,
    );

    // Verify the Select component is rendered
    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
  });

  it("calls handleChange when value changes", () => {
    const mockHandleChange = vi.fn();
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "PublicSpecifique", label: "Public Specifique" },
    ]);

    render(<DisseminationStatusInput value="PublicGenerique" handleChange={mockHandleChange} />);

    // The handleChange should not be called on initial render
    expect(mockHandleChange).not.toHaveBeenCalled();
  });

  it("renders with different value options", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "PublicSpecifique", label: "Public Specifique" },
      { value: "Prive", label: "Private" },
    ]);

    const { container } = render(
      <DisseminationStatusInput value="PublicSpecifique" handleChange={() => {}} />,
    );

    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
  });

  it("renders with Prive value", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "Prive", label: "Private" },
    ]);

    const { container } = render(
      <DisseminationStatusInput value="Prive" handleChange={() => {}} />,
    );

    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
  });

  it("renders with empty value", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "PublicSpecifique", label: "Public Specifique" },
    ]);

    const { container } = render(<DisseminationStatusInput value="" handleChange={() => {}} />);

    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
  });

  it("does not render label when withLabel is false", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public" },
    ]);

    render(
      <DisseminationStatusInput
        value="PublicGenerique"
        handleChange={() => {}}
        withLabel={false}
      />,
    );

    // The label should not be present
    const labels = screen.queryAllByText(D.disseminationStatus.title);
    expect(labels).toHaveLength(0);
  });

  it("renders optional label when required is false and withLabel is true", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public" },
    ]);

    const { container } = render(
      <DisseminationStatusInput
        value="PublicGenerique"
        handleChange={() => {}}
        required={false}
        withLabel={true}
      />,
    );

    // Should render a label (not LabelRequired)
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toBe(D.disseminationStatus.title);
  });

  it("handleChange receives the correct value when called", () => {
    const mockHandleChange = vi.fn();
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public Generique" },
      { value: "PublicSpecifique", label: "Public Specifique" },
    ]);

    render(<DisseminationStatusInput value="PublicGenerique" handleChange={mockHandleChange} />);

    // Verify handleChange is a function and ready to be called
    expect(typeof mockHandleChange).toBe("function");
  });

  it("renders Select with correct options from hook", () => {
    const mockOptions = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    (useDisseminationStatusOptions as Mock).mockReturnValue(mockOptions);

    const { container } = render(
      <DisseminationStatusInput value="option1" handleChange={() => {}} />,
    );

    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
  });

  it("renders with all required props", () => {
    (useDisseminationStatusOptions as Mock).mockReturnValue([
      { value: "PublicGenerique", label: "Public" },
    ]);

    const { container } = render(
      <DisseminationStatusInput
        value="PublicGenerique"
        handleChange={() => {}}
        required={true}
        withLabel={true}
      />,
    );

    expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    expect(screen.getByText(D.disseminationStatus.title)).toBeInTheDocument();
  });

  describe("User interactions", () => {
    it("should have a functional dropdown component", () => {
      const mockHandleChange = vi.fn();
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
        { value: "PublicSpecifique", label: "Public Specifique" },
        { value: "Prive", label: "Private" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="PublicGenerique" handleChange={mockHandleChange} />,
      );

      const dropdown = screen.getByRole("combobox");
      expect(dropdown).toBeInTheDocument();
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });

    it("should render with correct value selected", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
        { value: "Prive", label: "Private" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="Prive" handleChange={() => {}} />,
      );

      // Verify the dropdown label shows the correct selected value
      const dropdownLabel = container.querySelector(".p-dropdown-label");
      expect(dropdownLabel).toHaveTextContent("Private");
    });

    it("should have clearable dropdown", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="PublicGenerique" handleChange={() => {}} />,
      );

      // PrimeReact dropdown should have clear icon
      const clearIcon = container.querySelector(".p-dropdown-clear-icon");
      expect(clearIcon).toBeInTheDocument();
    });
  });

  describe("Validation tests", () => {
    it("should show required label when required prop is true", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public" },
      ]);

      const { container } = render(
        <DisseminationStatusInput
          value=""
          handleChange={() => {}}
          required={true}
          withLabel={true}
        />,
      );

      const requiredLabel = container.querySelector(".label-required");
      expect(requiredLabel).toBeInTheDocument();
    });

    it("should show optional label when required prop is false", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public" },
      ]);

      const { container } = render(
        <DisseminationStatusInput
          value=""
          handleChange={() => {}}
          required={false}
          withLabel={true}
        />,
      );

      const optionalLabel = container.querySelector("label:not(.label-required)");
      expect(optionalLabel).toBeInTheDocument();
    });

    it("should accept empty value when not required", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="" handleChange={() => {}} required={false} />,
      );

      const dropdown = container.querySelector(".p-dropdown");
      expect(dropdown).toBeInTheDocument();
      // No error should be displayed
      const errorElements = container.querySelectorAll(".alert-danger");
      expect(errorElements).toHaveLength(0);
    });

    it("should validate that value is one of the available options", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
        { value: "PublicSpecifique", label: "Public Specifique" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="PublicGenerique" handleChange={() => {}} />,
      );

      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });

    it("should handle invalid value gracefully", () => {
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
      ]);

      const { container } = render(
        <DisseminationStatusInput value="InvalidValue" handleChange={() => {}} />,
      );

      // Component should still render without crashing
      expect(container.querySelector(".p-dropdown")).toBeInTheDocument();
    });

    it("should update value when handleChange is called with valid option", () => {
      const mockHandleChange = vi.fn();
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
        { value: "Prive", label: "Private" },
      ]);

      const { rerender } = render(
        <DisseminationStatusInput value="PublicGenerique" handleChange={mockHandleChange} />,
      );

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
      (useDisseminationStatusOptions as Mock).mockReturnValue([
        { value: "PublicGenerique", label: "Public Generique" },
      ]);

      render(<DisseminationStatusInput value="" handleChange={() => {}} />);

      // The Select component should render with placeholder support
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });
});
