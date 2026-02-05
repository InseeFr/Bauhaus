import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VariableRepresentationTab } from "./VariableRepresentationTab";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.columns.type": "Type",
        "physicalInstance.view.selectType": "Sélectionnez un type",
        "physicalInstance.view.isGeographic": "Variable géographique",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/checkbox", () => ({
  Checkbox: ({ inputId, checked, onChange }: any) => (
    <input
      type="checkbox"
      id={inputId}
      checked={checked}
      onChange={(e) => onChange({ checked: e.target.checked })}
    />
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ id, value, onChange, options, required }: any) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
      required={required}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("../NumericRepresentation/NumericRepresentation", () => ({
  NumericRepresentation: ({ onChange }: any) => (
    <div data-testid="numeric-representation">
      <button onClick={() => onChange({ NumericTypeCode: "Integer" })}>Set Numeric</button>
    </div>
  ),
}));

vi.mock("../DateRepresentation/DateRepresentation", () => ({
  DateRepresentation: ({ onChange }: any) => (
    <div data-testid="date-representation">
      <button onClick={() => onChange({ DateTypeCode: "Date" })}>Set Date</button>
    </div>
  ),
}));

vi.mock("../TextRepresentation/TextRepresentation", () => ({
  TextRepresentation: ({ onChange }: any) => (
    <div data-testid="text-representation">
      <button onClick={() => onChange({ "@maxLength": "100" })}>Set Text</button>
    </div>
  ),
}));

vi.mock("../CodeRepresentation/CodeRepresentation", () => ({
  CodeRepresentation: ({ onChange }: any) => (
    <div data-testid="code-representation">
      <button onClick={() => onChange({ "@blankIsMissingValue": "false" })}>Set Code</button>
    </div>
  ),
}));

describe("VariableRepresentationTab", () => {
  const mockOnIsGeographicChange = vi.fn();
  const mockOnTypeChange = vi.fn();
  const mockOnNumericRepresentationChange = vi.fn();
  const mockOnDateRepresentationChange = vi.fn();
  const mockOnTextRepresentationChange = vi.fn();
  const mockOnCodeRepresentationChange = vi.fn();

  const typeOptions = [
    { label: "Numérique", value: "numeric" },
    { label: "Date", value: "date" },
    { label: "Texte", value: "text" },
    { label: "Code", value: "code" },
  ];

  const defaultProps = {
    variableId: "var-1",
    isGeographic: false,
    selectedType: "numeric",
    typeOptions,
    onIsGeographicChange: mockOnIsGeographicChange,
    onTypeChange: mockOnTypeChange,
    onNumericRepresentationChange: mockOnNumericRepresentationChange,
    onDateRepresentationChange: mockOnDateRepresentationChange,
    onTextRepresentationChange: mockOnTextRepresentationChange,
    onCodeRepresentationChange: mockOnCodeRepresentationChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render isGeographic checkbox", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    const checkbox = screen.getByLabelText("Variable géographique") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  it("should call onIsGeographicChange when checkbox is clicked", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    const checkbox = screen.getByLabelText("Variable géographique");
    fireEvent.click(checkbox);

    expect(mockOnIsGeographicChange).toHaveBeenCalledWith(true);
  });

  it("should render type dropdown with correct value", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    const typeSelect = screen.getByRole("combobox", {
      name: "Type",
    }) as HTMLSelectElement;
    expect(typeSelect.value).toBe("numeric");
  });

  it("should call onTypeChange when type changes", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    const typeSelect = screen.getByRole("combobox", { name: "Type" });
    fireEvent.change(typeSelect, { target: { value: "text" } });

    expect(mockOnTypeChange).toHaveBeenCalledWith("text");
  });

  it("should show NumericRepresentation when type is numeric", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    expect(screen.getByTestId("numeric-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("date-representation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("text-representation")).not.toBeInTheDocument();
    expect(screen.queryByTestId("code-representation")).not.toBeInTheDocument();
  });

  it("should show DateRepresentation when type is date", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="date" />);

    expect(screen.getByTestId("date-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should show TextRepresentation when type is text", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="text" />);

    expect(screen.getByTestId("text-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should show CodeRepresentation when type is code", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="code" />);

    expect(screen.getByTestId("code-representation")).toBeInTheDocument();
    expect(screen.queryByTestId("numeric-representation")).not.toBeInTheDocument();
  });

  it("should pass numeric representation change callback", () => {
    render(<VariableRepresentationTab {...defaultProps} />);

    const button = screen.getByText("Set Numeric");
    fireEvent.click(button);

    expect(mockOnNumericRepresentationChange).toHaveBeenCalledWith({
      NumericTypeCode: "Integer",
    });
  });

  it("should pass date representation change callback", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="date" />);

    const button = screen.getByText("Set Date");
    fireEvent.click(button);

    expect(mockOnDateRepresentationChange).toHaveBeenCalledWith({
      DateTypeCode: "Date",
    });
  });

  it("should pass text representation change callback", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="text" />);

    const button = screen.getByText("Set Text");
    fireEvent.click(button);

    expect(mockOnTextRepresentationChange).toHaveBeenCalledWith({
      "@maxLength": "100",
    });
  });

  it("should pass code representation change callback", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="code" />);

    const button = screen.getByText("Set Code");
    fireEvent.click(button);

    expect(mockOnCodeRepresentationChange).toHaveBeenCalledWith({
      "@blankIsMissingValue": "false",
    });
  });
});
