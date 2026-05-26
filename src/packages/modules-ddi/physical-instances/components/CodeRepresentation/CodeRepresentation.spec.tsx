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

const mockUseAllCodesLists = vi.fn(() => ({
  data: [
    { id: "list-1", label: "Liste 1", agencyId: "fr.insee", mutualized: false },
    { id: "list-2", label: "Liste 2", agencyId: "fr.insee", mutualized: false },
  ],
  isLoading: false,
  error: null,
}));

vi.mock("../../../hooks/useAllCodesLists", () => ({
  useAllCodesLists: () => mockUseAllCodesLists(),
}));

const mockUseMutualizedCodesList = vi.fn((_agency: string, _id: string) => ({
  data: undefined as any,
  isLoading: false,
  isSuccess: false,
  error: null,
}));

vi.mock("../../../hooks/useMutualizedCodesList", () => ({
  useMutualizedCodesList: (agency: string, id: string) => mockUseMutualizedCodesList(agency, id),
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

vi.mock("primereact/overlaypanel", () => ({
  OverlayPanel: vi.fn().mockImplementation(() => null),
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
    $type: "CodeRepresentationBaseType",
    BlankIsMissingValue: false,
    CodeListReference: {
      $type: "CodeList",
      URN: "urn:ddi:fr.insee:codelist-1:1",
      Agency: "fr.insee",
      ID: "codelist-1",
      Version: "1",
    },
  };

  const mockCodeList: CodeList = {
    $type: "CodeList",
    VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
    URN: "urn:ddi:fr.insee:codelist-1:1",
    Agency: "fr.insee",
    ID: "codelist-1",
    Version: "1",
    Label: [{ "@language": "fr-FR", "@value": "Liste de codes test" }],
    Code: [
      {
        $type: "CodeType",
        URN: "urn:ddi:fr.insee:code-1:1",
        Agency: "fr.insee",
        ID: "code-1",
        Version: "1",
        CategoryReference: {
          $type: "Category",
          URN: "urn:ddi:fr.insee:category-1:1",
          Agency: "fr.insee",
          ID: "category-1",
          Version: "1",
        },
        Value: { StringValue: "1" },
      },
    ],
  };

  const mockCategories: Category[] = [
    {
      $type: "Category",
      VersionDate: { DateTime: "2024-01-01T00:00:00Z" },
      URN: "urn:ddi:fr.insee:category-1:1",
      Agency: "fr.insee",
      ID: "category-1",
      Version: "1",
      Label: [{ "@language": "fr-FR", "@value": "Oui" }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAllCodesLists.mockReturnValue({
      data: [
        { id: "codelist-1", label: "Liste 1", agencyId: "fr.insee", mutualized: false },
        { id: "list-2", label: "Liste 2", agencyId: "fr.insee", mutualized: false },
      ],
      isLoading: false,
      error: null,
    });
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

    it("should keep ReuseCodeListSelect visible when reuse button is clicked again", () => {
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
      expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();
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
          Label: [{ "@language": "fr-FR", "@value": "Nouveau libellé" }],
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
        Label: [{ "@language": "fr-FR", "@value": "Liste modifiée" }],
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

    it("should preserve label when codeList content changes but ID stays the same", () => {
      const { rerender } = render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      // Modifier le label localement
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.change(labelInput, {
        target: { value: "Label modifié par l'utilisateur" },
      });

      // Simuler une mise à jour du codeList avec le même ID (comme lors de l'ajout d'un code)
      const updatedCodeList: CodeList = {
        ...mockCodeList,
        Code: [
          ...mockCodeList.Code,
          {
            $type: "CodeType",
            URN: "urn:ddi:fr.insee:code-2:1",
            Agency: "fr.insee",
            ID: "code-2",
            Version: "1",
            CategoryReference: {
              $type: "Category",
              URN: "urn:ddi:fr.insee:category-2:1",
              Agency: "fr.insee",
              ID: "category-2",
              Version: "1",
            },
            Value: { StringValue: "2" },
          },
        ],
      };

      rerender(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={updatedCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      // Le label devrait être préservé car l'ID n'a pas changé
      const labelInputAfter = screen.getByLabelText(
        "Libellé de la liste de codes",
      ) as HTMLInputElement;
      expect(labelInputAfter.value).toBe("Label modifié par l'utilisateur");
    });
  });

  describe("label preservation during editing", () => {
    it("should preserve label when adding a code", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      // Modifier le label
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.change(labelInput, { target: { value: "Mon label" } });

      // Ajouter un code
      const addButton = screen.getByText("Ajouter un code");
      fireEvent.click(addButton);

      // Vérifier que onChange a été appelé avec le label préservé
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          Label: [{ "@language": "fr-FR", "@value": "Mon label" }],
        }),
        expect.anything(),
      );
    });

    it("should preserve label when editing a code value", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      // Modifier le label
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.change(labelInput, { target: { value: "Mon label" } });

      vi.clearAllMocks();

      // Modifier un code (via l'input dans le tableau)
      const codeInputs = screen.getAllByPlaceholderText("Valeur");
      fireEvent.change(codeInputs[0], { target: { value: "10" } });

      // Vérifier que onChange a été appelé avec le label préservé
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          Label: [{ "@language": "fr-FR", "@value": "Mon label" }],
        }),
        expect.anything(),
      );
    });
  });

  describe("read-only for mutualized lists", () => {
    it("should make code list inputs read-only when the referenced list is mutualized", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [
          { id: "codelist-1", label: "Liste mutualisée", agencyId: "fr.insee", mutualized: true },
        ],
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

      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      expect(labelInput).toHaveAttribute("readOnly");
      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
    });

    it("should keep code list inputs editable when the referenced list is local", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      expect(labelInput).not.toHaveAttribute("readOnly");
      expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
    });
  });

  describe("selection of a mutualized list", () => {
    it("should display a spinner while the mutualized codes list is loading", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [{ id: "mut-1", label: "Liste mutualisée", agencyId: "fr.insee", mutualized: true }],
        isLoading: false,
        error: null,
      });

      const loadingResult = {
        data: undefined as any,
        isLoading: true,
        isSuccess: false,
        error: null,
      };
      const idleResult = {
        data: undefined as any,
        isLoading: false,
        isSuccess: false,
        error: null,
      };
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) =>
        agency === "fr.insee" && id === "mut-1" ? loadingResult : idleResult,
      );

      render(
        <CodeRepresentation
          representation={undefined}
          codeList={undefined}
          categories={[]}
          onChange={mockOnChange}
        />,
      );

      fireEvent.click(screen.getByText("Réutiliser"));
      fireEvent.change(screen.getByTestId("codes-list-dropdown"), {
        target: { value: "fr.insee-mut-1" },
      });

      expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });

    it("should fetch and display codes read-only after selecting a mutualized list", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [{ id: "mut-1", label: "Liste mutualisée", agencyId: "fr.insee", mutualized: true }],
        isLoading: false,
        error: null,
      });

      const mutualizedData = {
        CodeList: [
          {
            Agency: "fr.insee",
            ID: "mut-1",
            Label: [{ "@language": "fr-FR", "@value": "Liste mutualisée" }],
            Code: [
              {
                ID: "code-1",
                Value: { StringValue: "01" },
                CategoryReference: { ID: "cat-1" },
              },
            ],
          },
        ],
        Category: [
          {
            ID: "cat-1",
            Label: [{ "@language": "fr-FR", "@value": "Agriculture" }],
          },
        ],
      };
      const idleResult = {
        data: undefined,
        isLoading: false,
        isSuccess: false,
        error: null,
      };
      const successResult = {
        data: mutualizedData,
        isLoading: false,
        isSuccess: true,
        error: null,
      };
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) =>
        agency === "fr.insee" && id === "mut-1" ? successResult : idleResult,
      );

      render(
        <CodeRepresentation
          representation={undefined}
          codeList={undefined}
          categories={[]}
          onChange={mockOnChange}
        />,
      );

      fireEvent.click(screen.getByText("Réutiliser"));

      const dropdown = screen.getByTestId("codes-list-dropdown");
      fireEvent.change(dropdown, { target: { value: "fr.insee-mut-1" } });

      const valueInputs = screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[];
      const labelInputs = screen.getAllByPlaceholderText("Libellé") as HTMLInputElement[];
      expect(valueInputs.some((i) => i.value === "01")).toBe(true);
      expect(labelInputs.some((i) => i.value === "Agriculture")).toBe(true);
      // read-only mode: no "Ajouter un code" button
      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
      // dropdown stays visible so the user can change selection
      expect(screen.getByTestId("codes-list-dropdown")).toBeInTheDocument();
    });
  });
});
