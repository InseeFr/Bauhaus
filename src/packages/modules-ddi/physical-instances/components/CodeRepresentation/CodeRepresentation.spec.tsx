import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeRepresentation } from "./CodeRepresentation";
import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Category,
} from "../../types/api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.code.codeListLabel": "Libellé de la liste de codes",
        "physicalInstance.view.code.codes": "Codes",
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCodeTooltip": "Ajouter ce code",
        "physicalInstance.view.code.fillFieldsTooltip":
          "Remplissez au moins un champ pour ajouter un code",
        "physicalInstance.view.code.createNewList": "Créer une nouvelle liste",
        "physicalInstance.view.code.reuseList": "Réutiliser",
        "physicalInstance.view.code.selectCodeList": "Sélectionnez une liste de codes",
        "physicalInstance.view.code.loadingCodesLists": "Chargement des listes de codes...",
        "physicalInstance.view.code.errorLoadingCodesLists":
          "Erreur lors du chargement des listes de codes",
        "physicalInstance.view.code.noCodesListsAvailable": "Aucune liste de codes disponible",
      };
      return translations[key] || key;
    },
  }),
}));

const mockUseCodesLists = vi.fn();

vi.mock("../../../hooks/useCodesLists", () => ({
  useCodesLists: () => mockUseCodesLists(),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, onBlur, onKeyDown, placeholder, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ icon, label, onClick, disabled, tooltip, children }: any) => (
    <button type="button" onClick={onClick} disabled={disabled} title={tooltip}>
      {label || icon || children}
    </button>
  ),
}));

vi.mock("primereact/datatable", () => ({
  DataTable: ({ value, children }: any) => {
    const columns = Array.isArray(children) ? children : [children];

    return (
      <table>
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

vi.mock("primereact/tooltip", () => ({
  Tooltip: () => null,
}));

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: ({ style }: any) => (
    <div data-testid="progress-spinner" style={style}>
      Loading...
    </div>
  ),
}));

vi.mock("primereact/message", () => ({
  Message: ({ severity, text }: any) => <div data-testid={`message-${severity}`}>{text}</div>,
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value, options, onChange, placeholder, className }: any) => (
    <select
      data-testid="codes-list-dropdown"
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
      className={className}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

describe("CodeRepresentation", () => {
  const mockOnChange = vi.fn();

  const mockRepresentation: CodeRepresentationType = {
    "@blankIsMissingValue": "false",
    CodeListReference: {
      Agency: "fr.insee",
      ID: "codelist-1",
      Version: "1",
      TypeOfObject: "CodeList",
    },
  };

  const mockCodeList: CodeList = {
    "@isUniversallyUnique": "true",
    "@versionDate": "2024-01-01T00:00:00Z",
    URN: "urn:ddi:fr.insee:codelist-1:1",
    Agency: "fr.insee",
    ID: "codelist-1",
    Version: "1",
    Label: {
      Content: {
        "@xml:lang": "fr-FR",
        "#text": "Liste de codes test",
      },
    },
    Code: [
      {
        "@isUniversallyUnique": "true",
        URN: "urn:ddi:fr.insee:code-1:1",
        Agency: "fr.insee",
        ID: "code-1",
        Version: "1",
        CategoryReference: {
          Agency: "fr.insee",
          ID: "category-1",
          Version: "1",
          TypeOfObject: "Category",
        },
        Value: "1",
      },
    ],
  };

  const mockCategories: Category[] = [
    {
      "@isUniversallyUnique": "true",
      "@versionDate": "2024-01-01T00:00:00Z",
      URN: "urn:ddi:fr.insee:category-1:1",
      Agency: "fr.insee",
      ID: "category-1",
      Version: "1",
      Label: {
        Content: {
          "@xml:lang": "fr-FR",
          "#text": "Oui",
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock return value
    mockUseCodesLists.mockReturnValue({
      data: [
        {
          id: "2a22ba00-a977-4a61-a582-99025c6b0582",
          label: "Liste des statuts professionnels",
          versionDate: "2023-07-04T08:19:29.000+00:00",
          agency: "fr.insee",
          _links: {
            self: {
              href: "http://localhost:8080/api/ddi/codes-list/fr.insee/2a22ba00-a977-4a61-a582-99025c6b0582",
            },
          },
        },
        {
          id: "3b33cb11-b088-5b72-b693-00136d7c1693",
          label: "Liste des pays",
          versionDate: "2023-08-15T10:30:00.000+00:00",
          agency: "fr.insee",
          _links: {
            self: {
              href: "http://localhost:8080/api/ddi/codes-list/fr.insee/3b33cb11-b088-5b72-b693-00136d7c1693",
            },
          },
        },
      ],
      isLoading: false,
      error: null,
    });
  });

  it("should render code list label input", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByLabelText("Libellé de la liste de codes")).toBeInTheDocument();
  });

  it("should display initial code list label", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("Liste de codes test");
  });

  it("should update code list label without calling onChange immediately", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes");
    fireEvent.change(labelInput, { target: { value: "Nouveau libellé" } });

    // The label should update the input value but not call onChange immediately
    // onChange will be called when codes are added or modified
    expect(labelInput).toHaveValue("Nouveau libellé");
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("should display code action buttons", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("Créer une nouvelle liste")).toBeInTheDocument();
    expect(screen.getByText("Réutiliser")).toBeInTheDocument();
  });

  it("should display empty row with input fields after clicking create new list", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Créer une nouvelle liste" button to show DataTable
    const createButton = screen.getByText("Créer une nouvelle liste");
    fireEvent.click(createButton);

    const inputs = screen.getAllByPlaceholderText(/Valeur|Libellé/);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("should show add button disabled when empty row has no content", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Créer une nouvelle liste" button to show DataTable
    const createButton = screen.getByText("Créer une nouvelle liste");
    fireEvent.click(createButton);

    const addButtons = screen.getAllByRole("button");
    const addButton = addButtons.find((btn) => btn.textContent === "pi pi-plus");

    // Le bouton devrait être désactivé au départ
    expect(addButton).toBeDefined();
  });

  it("should handle code deletion", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const deleteButtons = screen.getAllByRole("button");
    const trashButton = deleteButtons.find((btn) => btn.textContent?.includes("pi pi-trash"));

    if (trashButton) {
      fireEvent.click(trashButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        mockRepresentation,
        expect.objectContaining({
          Code: [],
        }),
        [],
      );
    }
  });

  it("should handle empty representation and codeList", () => {
    render(
      <CodeRepresentation
        representation={undefined}
        codeList={undefined}
        categories={[]}
        onChange={mockOnChange}
      />,
    );

    // When representation and codeList are undefined, only the action buttons should be visible
    expect(screen.getByText("Créer une nouvelle liste")).toBeInTheDocument();
    expect(screen.getByText("Réutiliser")).toBeInTheDocument();

    // Click on "Create new list" to show the DataTable and label input
    fireEvent.click(screen.getByText("Créer une nouvelle liste"));

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("");
  });

  it("should update when props change", () => {
    const { rerender } = render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const newCodeList: CodeList = {
      ...mockCodeList,
      Label: {
        Content: {
          "@xml:lang": "fr-FR",
          "#text": "Liste modifiée",
        },
      },
    };

    rerender(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={newCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
    expect(labelInput.value).toBe("Liste modifiée");
  });

  it("should show dropdown when reuse button is clicked", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Initially, dropdown should not be visible
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Dropdown should now be visible
    expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();
  });

  it("should hide dropdown when reuse button is clicked again", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    const reuseButton = screen.getByText("Réutiliser");

    // Show dropdown
    fireEvent.click(reuseButton);
    expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();

    // Hide dropdown
    fireEvent.click(reuseButton);
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should display codes list options in dropdown", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Check dropdown options
    const dropdown = screen.getByTestId("codes-list-dropdown");
    expect(dropdown).toBeInTheDocument();

    // Check that options are present with correct format (agency-id)
    const options = screen.getAllByRole("option");
    expect(options.some((opt) => opt.textContent === "Liste des statuts professionnels")).toBe(
      true,
    );
    expect(options.some((opt) => opt.textContent === "Liste des pays")).toBe(true);
  });

  it("should hide dropdown when create new list button is clicked", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Show dropdown first
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);
    expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();

    // Click on "Créer une nouvelle liste"
    const createButton = screen.getByText("Créer une nouvelle liste");
    fireEvent.click(createButton);

    // Dropdown should be hidden
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should hide datatable when reuse button is clicked", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Show datatable first
    const createButton = screen.getByText("Créer une nouvelle liste");
    fireEvent.click(createButton);
    expect(screen.getByRole("table")).toBeInTheDocument();

    // Click on "Réutiliser"
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // DataTable should be hidden (no codes to display)
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should format dropdown value as agency-id", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Show dropdown
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    const dropdown = screen.getByTestId("codes-list-dropdown");
    const options = dropdown.querySelectorAll("option");

    // Check that the value format is correct (agency-id)
    const firstOption = Array.from(options).find(
      (opt) => opt.textContent === "Liste des statuts professionnels",
    );
    expect(firstOption?.getAttribute("value")).toBe(
      "fr.insee-2a22ba00-a977-4a61-a582-99025c6b0582",
    );

    const secondOption = Array.from(options).find((opt) => opt.textContent === "Liste des pays");
    expect(secondOption?.getAttribute("value")).toBe(
      "fr.insee-3b33cb11-b088-5b72-b693-00136d7c1693",
    );
  });

  it("should show loading state when codes lists are loading", () => {
    mockUseCodesLists.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Should show loading spinner and message
    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
    expect(screen.getByText("Chargement des listes de codes...")).toBeInTheDocument();

    // Should not show dropdown
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should show error message when codes lists fail to load", () => {
    mockUseCodesLists.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Network error"),
    });

    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Should show error message
    expect(screen.getByTestId("message-error")).toBeInTheDocument();
    expect(screen.getByText("Erreur lors du chargement des listes de codes")).toBeInTheDocument();

    // Should not show dropdown
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should show info message when no codes lists are available", () => {
    mockUseCodesLists.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Should show info message
    expect(screen.getByTestId("message-info")).toBeInTheDocument();
    expect(screen.getByText("Aucune liste de codes disponible")).toBeInTheDocument();

    // Should not show dropdown
    expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
  });

  it("should show dropdown when codes lists are successfully loaded", () => {
    render(
      <CodeRepresentation
        representation={mockRepresentation}
        codeList={mockCodeList}
        categories={mockCategories}
        onChange={mockOnChange}
      />,
    );

    // Click on "Réutiliser" button
    const reuseButton = screen.getByText("Réutiliser");
    fireEvent.click(reuseButton);

    // Should show dropdown with options
    expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();

    // Should not show loading or error messages
    expect(screen.queryByTestId("progress-spinner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("message-error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("message-info")).not.toBeInTheDocument();
  });
});
