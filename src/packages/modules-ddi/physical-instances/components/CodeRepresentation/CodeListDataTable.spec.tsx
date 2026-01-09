import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.codeListLabel": "Libellé de la liste de codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCodeTooltip": "Ajouter ce code",
        "physicalInstance.view.code.fillFieldsTooltip":
          "Remplissez au moins un champ pour ajouter un code",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, onKeyDown, placeholder, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      data-testid={id || placeholder}
      {...props}
    />
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ icon, onClick, disabled, tooltip }: any) => (
    <button type="button" onClick={onClick} disabled={disabled} title={tooltip}>
      {icon}
    </button>
  ),
}));

vi.mock("primereact/datatable", () => ({
  DataTable: ({ value, children }: any) => {
    const columns = Array.isArray(children) ? children : [children];

    return (
      <table>
        <thead>
          <tr>
            {columns.map((column: any, colIndex: number) => (
              <th key={colIndex}>{column?.props?.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value?.map((row: any, index: number) => (
            <tr key={index} data-testid={`row-${index}`}>
              {columns.map((column: any, colIndex: number) => {
                if (column?.props?.body) {
                  return <td key={colIndex}>{column.props.body(row)}</td>;
                }
                return <td key={colIndex}>{row[column?.props?.field]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock("primereact/column", () => ({
  Column: () => null,
}));

describe("CodeListDataTable", () => {
  const mockOnCodeListLabelChange = vi.fn();
  const mockOnCellEdit = vi.fn();
  const mockOnDeleteCode = vi.fn();
  const mockOnAddCode = vi.fn();

  const mockCodes: CodeTableRow[] = [
    { id: "code-1", value: "1", label: "Label 1", categoryId: "category-1" },
    { id: "code-2", value: "2", label: "Label 2", categoryId: "category-2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render code list label input", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    expect(screen.getByLabelText("Libellé de la liste de codes")).toBeInTheDocument();
  });

  it("should display initial code list label", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("Test Label");
  });

  it("should call onCodeListLabelChange when label changes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes");
    fireEvent.change(labelInput, { target: { value: "New Label" } });

    expect(mockOnCodeListLabelChange).toHaveBeenCalledWith("New Label");
  });

  it("should render table with codes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    // 2 codes + 1 empty row
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(3);
  });

  it("should render empty row with placeholders", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    expect(screen.getByPlaceholderText("Valeur")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Libellé")).toBeInTheDocument();
  });

  it("should have disabled add button when empty row has no content", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const addButton = screen.getByText("pi pi-plus");
    expect(addButton).toBeDisabled();
  });

  it("should enable add button when empty row has content", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const valueInput = screen.getByPlaceholderText("Valeur");
    fireEvent.change(valueInput, { target: { value: "new-value" } });

    const addButton = screen.getByText("pi pi-plus");
    expect(addButton).not.toBeDisabled();
  });

  it("should call onAddCode when add button is clicked", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const valueInput = screen.getByPlaceholderText("Valeur");
    const labelInput = screen.getByPlaceholderText("Libellé");

    fireEvent.change(valueInput, { target: { value: "new-value" } });
    fireEvent.change(labelInput, { target: { value: "new-label" } });

    const addButton = screen.getByText("pi pi-plus");
    fireEvent.click(addButton);

    expect(mockOnAddCode).toHaveBeenCalledWith("new-value", "new-label");
  });

  it("should call onAddCode when Enter is pressed in value input", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const valueInput = screen.getByPlaceholderText("Valeur");
    fireEvent.change(valueInput, { target: { value: "new-value" } });
    fireEvent.keyDown(valueInput, { key: "Enter" });

    expect(mockOnAddCode).toHaveBeenCalledWith("new-value", "");
  });

  it("should call onAddCode when Enter is pressed in label input", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const labelInput = screen.getByPlaceholderText("Libellé");
    fireEvent.change(labelInput, { target: { value: "new-label" } });
    fireEvent.keyDown(labelInput, { key: "Enter" });

    expect(mockOnAddCode).toHaveBeenCalledWith("", "new-label");
  });

  it("should not call onAddCode when empty row has no content", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const valueInput = screen.getByPlaceholderText("Valeur");
    fireEvent.keyDown(valueInput, { key: "Enter" });

    expect(mockOnAddCode).not.toHaveBeenCalled();
  });

  it("should clear empty row inputs after adding a code", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const valueInput = screen.getByPlaceholderText("Valeur") as HTMLInputElement;
    const labelInput = screen.getByPlaceholderText("Libellé") as HTMLInputElement;

    fireEvent.change(valueInput, { target: { value: "new-value" } });
    fireEvent.change(labelInput, { target: { value: "new-label" } });

    const addButton = screen.getByText("pi pi-plus");
    fireEvent.click(addButton);

    expect(valueInput.value).toBe("");
    expect(labelInput.value).toBe("");
  });

  it("should call onDeleteCode when delete button is clicked", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    const deleteButtons = screen.getAllByText("pi pi-trash");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteCode).toHaveBeenCalledWith("code-1");
  });

  it("should call onCellEdit when code value is edited", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    // Find all inputs and filter out placeholders and the label input
    const inputs = screen.getAllByRole("textbox");
    // The first input is the code list label, then we have value/label pairs for each code, then empty row
    // mockCodes has 2 codes, so: 1 (label) + 2*2 (codes) + 2 (empty row) = 7 inputs
    // Code value inputs are at positions 1, 3 (after the label input)
    const codeValueInput = inputs[1] as HTMLInputElement;

    // Verify it's the right input by checking its value
    expect(codeValueInput.value).toBe("1");

    fireEvent.change(codeValueInput, { target: { value: "updated-value" } });

    expect(mockOnCellEdit).toHaveBeenCalledWith(
      mockCodes[0],
      "value",
      "updated-value",
    );
  });

  it("should render with empty codes array", () => {
    render(
      <CodeListDataTable
        codeListLabel=""
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    // Only empty row
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(1);
  });
});
