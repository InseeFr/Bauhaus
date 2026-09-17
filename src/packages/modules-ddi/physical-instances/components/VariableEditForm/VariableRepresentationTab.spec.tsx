import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import {
  expectRepresentation,
  nonNumericRepresentationCases,
  typeOptions,
} from "./variableForm.testing";
import { VariableRepresentationTab } from "./VariableRepresentationTab";

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({
    "physicalInstance.view.columns.type": "Type",
    "physicalInstance.view.selectType": "Sélectionnez un type",
  }),
);

vi.mock("primereact/dropdown", () => import("../representation.testing"));

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
      <button onClick={() => onChange({ MaxLength: 100 })}>Set Text</button>
    </div>
  ),
}));

vi.mock("../SentinelValues/SentinelValues", () => ({
  SentinelValues: () => <div data-testid="sentinel-values" />,
}));

vi.mock("../CodeRepresentation/CodeRepresentation", () => ({
  CodeRepresentation: ({ onChange }: any) => (
    <div data-testid="code-representation">
      <button onClick={() => onChange({ BlankIsMissingValue: false })}>Set Code</button>
    </div>
  ),
}));

describe("VariableRepresentationTab", () => {
  const mockOnTypeChange = vi.fn();
  const mockOnNumericRepresentationChange = vi.fn();
  const mockOnDateRepresentationChange = vi.fn();
  const mockOnTextRepresentationChange = vi.fn();
  const mockOnCodeRepresentationChange = vi.fn();
  const mockOnSentinelValuesChange = vi.fn();

  const defaultProps = {
    variableId: "var-1",
    selectedType: "numeric",
    typeOptions,
    onTypeChange: mockOnTypeChange,
    onNumericRepresentationChange: mockOnNumericRepresentationChange,
    onDateRepresentationChange: mockOnDateRepresentationChange,
    onTextRepresentationChange: mockOnTextRepresentationChange,
    onCodeRepresentationChange: mockOnCodeRepresentationChange,
    onSentinelValuesChange: mockOnSentinelValuesChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
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

    expectRepresentation("numeric", ["date", "text", "code"]);
  });

  for (const { name, type } of nonNumericRepresentationCases) {
    it(name, () => {
      render(<VariableRepresentationTab {...defaultProps} selectedType={type} />);

      expectRepresentation(type, ["numeric"]);
    });
  }

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
      MaxLength: 100,
    });
  });

  it("should pass code representation change callback", () => {
    render(<VariableRepresentationTab {...defaultProps} selectedType="code" />);

    const button = screen.getByText("Set Code");
    fireEvent.click(button);

    expect(mockOnCodeRepresentationChange).toHaveBeenCalledWith({
      BlankIsMissingValue: false,
    });
  });
});
