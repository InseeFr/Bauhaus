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
        "physicalInstance.view.code.value": "Valeur",
        "physicalInstance.view.code.label": "Libellé",
        "physicalInstance.view.code.addCode": "Ajouter un code",
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

vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({
    id: "test-physical-instance-id",
    agencyId: "fr.insee",
  }),
}));

vi.mock("../../../hooks/useAllCodesLists", () => ({
  useAllCodesLists: () => ({
    data: [
      { id: "list-1", label: "Liste 1", agencyId: "fr.insee" },
      { id: "list-2", label: "Liste 2", agencyId: "fr.insee" },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, placeholder, ...props }: any) => (
    <input id={id} value={value} onChange={onChange} placeholder={placeholder} {...props} />
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ icon, label, onClick, disabled, tooltip }: any) => (
    <button type="button" onClick={onClick} disabled={disabled} title={tooltip}>
      {label || icon}
    </button>
  ),
}));

vi.mock("primereact/datatable", () => ({
  DataTable: ({ value, children }: any) => {
    const columns = Array.isArray(children) ? children : [children];
    return (
      <table data-testid="data-table">
        <tbody>
          {value?.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((column: any, colIndex: number) => (
                <td key={colIndex}>{column?.props?.body?.(row, { rowIndex: index })}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
}));

vi.mock("primereact/menu", () => ({
  Menu: vi.fn().mockImplementation(() => null),
}));

vi.mock("primereact/column", () => ({
  Column: () => null,
}));

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: () => <div data-testid="progress-spinner">Loading...</div>,
}));

vi.mock("primereact/message", () => ({
  Message: ({ severity, text }: any) => <div data-testid={`message-${severity}`}>{text}</div>,
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value, options, onChange, placeholder }: any) => (
    <select
      data-testid="codes-list-dropdown"
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
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
  });

  describe("initialization", () => {
    it("should render action buttons", () => {
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

    it("should show DataTable when codeList has codes", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });

    it("should not show DataTable when codeList is undefined", () => {
      render(
        <CodeRepresentation
          representation={undefined}
          codeList={undefined}
          categories={[]}
          onChange={mockOnChange}
        />,
      );

      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });

    it("should initialize label from codeList", () => {
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
  });

  describe("toggle between modes", () => {
    it("should show ReuseCodeListSelect when reuse button is clicked", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Réutiliser"));

      expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();
    });

    it("should toggle ReuseCodeListSelect visibility", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      const reuseButton = screen.getByText("Réutiliser");

      fireEvent.click(reuseButton);
      expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();

      fireEvent.click(reuseButton);
      expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
    });

    it("should hide ReuseCodeListSelect when create new list is clicked", () => {
      render(
        <CodeRepresentation
          representation={undefined}
          codeList={undefined}
          categories={[]}
          onChange={mockOnChange}
        />,
      );

      fireEvent.click(screen.getByText("Réutiliser"));
      expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));
      expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });

    it("should hide DataTable when reuse button is clicked", () => {
      render(
        <CodeRepresentation
          representation={undefined}
          codeList={undefined}
          categories={[]}
          onChange={mockOnChange}
        />,
      );

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));
      expect(screen.getByTestId("data-table")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Réutiliser"));
      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });
  });

  describe("onChange callbacks", () => {
    it("should call onChange when label is updated", () => {
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

      expect(mockOnChange).toHaveBeenCalledWith(
        mockRepresentation,
        expect.objectContaining({
          Label: {
            Content: {
              "@xml:lang": "fr-FR",
              "#text": "Nouveau libellé",
            },
          },
        }),
        mockCategories,
      );
    });
  });

  describe("props update", () => {
    it("should update state when a different codeList is loaded", () => {
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
        ID: "codelist-2",
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
  });
});
