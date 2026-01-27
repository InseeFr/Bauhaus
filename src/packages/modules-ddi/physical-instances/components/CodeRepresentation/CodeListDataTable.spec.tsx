import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeListDataTable, CodeTableRow } from "./CodeListDataTable";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.codeListLabel":
          "Libellé de la liste de codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCode": "Ajouter un code",
        "physicalInstance.view.code.noCodes": "Aucun code",
        "physicalInstance.view.code.actionsMenu": "Menu des actions",
        "physicalInstance.view.code.moveUp": "Monter",
        "physicalInstance.view.code.moveDown": "Descendre",
        "physicalInstance.view.code.deleteCode": "Supprimer",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, placeholder, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={id || placeholder}
      {...props}
    />
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ icon, onClick, label, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {label || icon}
    </button>
  ),
}));

vi.mock("primereact/menu", () => ({
  Menu: vi.fn().mockImplementation(() => null),
}));

vi.mock("primereact/datatable", () => ({
  DataTable: ({ value, children, emptyMessage }: any) => {
    const columns = Array.isArray(children) ? children : [children];

    if (!value || value.length === 0) {
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
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          </tbody>
        </table>
      );
    }

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
                  return (
                    <td key={colIndex}>
                      {column.props.body(row, { rowIndex: index })}
                    </td>
                  );
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
  const mockOnMoveCode = vi.fn();

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
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(
      screen.getByLabelText("Libellé de la liste de codes"),
    ).toBeInTheDocument();
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
        onMoveCode={mockOnMoveCode}
      />,
    );

    const labelInput = screen.getByLabelText(
      "Libellé de la liste de codes",
    ) as HTMLInputElement;
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
        onMoveCode={mockOnMoveCode}
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
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByTestId(/^row-/)).toHaveLength(2);
  });

  it("should render Add a code button", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });

  it("should call onAddCode when Add a code button is clicked", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const addButton = screen.getByText("Ajouter un code");
    fireEvent.click(addButton);

    expect(mockOnAddCode).toHaveBeenCalledWith("", "");
  });

  it("should show empty message when no codes", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={[]}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByText("Aucun code")).toBeInTheDocument();
  });

  it("should render action menu button for each code", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const menuButtons = screen.getAllByText("pi pi-ellipsis-v");
    expect(menuButtons).toHaveLength(2);
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
        onMoveCode={mockOnMoveCode}
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    // First input is code list label, then value/label pairs for each code
    const codeValueInput = inputs[1] as HTMLInputElement;

    expect(codeValueInput.value).toBe("1");

    fireEvent.change(codeValueInput, { target: { value: "updated-value" } });

    expect(mockOnCellEdit).toHaveBeenCalledWith(
      mockCodes[0],
      "value",
      "updated-value",
    );
  });

  it("should call onCellEdit when code label is edited", () => {
    render(
      <CodeListDataTable
        codeListLabel="Test Label"
        codes={mockCodes}
        onCodeListLabelChange={mockOnCodeListLabelChange}
        onCellEdit={mockOnCellEdit}
        onDeleteCode={mockOnDeleteCode}
        onAddCode={mockOnAddCode}
        onMoveCode={mockOnMoveCode}
      />,
    );

    const inputs = screen.getAllByRole("textbox");
    // First input is code list label, then value/label pairs for each code
    const codeLabelInput = inputs[2] as HTMLInputElement;

    expect(codeLabelInput.value).toBe("Label 1");

    fireEvent.change(codeLabelInput, { target: { value: "Updated Label" } });

    expect(mockOnCellEdit).toHaveBeenCalledWith(
      mockCodes[0],
      "label",
      "Updated Label",
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
        onMoveCode={mockOnMoveCode}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
  });
});
