import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
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
  Dropdown: ({
    value,
    options,
    onChange,
    placeholder,
    optionGroupLabel,
    optionGroupChildren,
    optionLabel,
    optionValue,
  }: any) => (
    <select
      data-testid="codes-list-dropdown"
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options?.map((group: any) => (
        <optgroup key={group[optionGroupLabel]} label={group[optionGroupLabel]}>
          {group[optionGroupChildren].map((option: any) => (
            <option key={option[optionValue]} value={option[optionValue]}>
              {option[optionLabel]}
            </option>
          ))}
        </optgroup>
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

  describe("reset when create new list is clicked", () => {
    it("should reset to an empty new code list when create new list is clicked after reusing a list", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [{ id: "grp-1", label: "Liste groupe", agencyId: "fr.insee", mutualized: false }],
        isLoading: false,
        error: null,
      });

      const groupData = {
        CodeList: [
          {
            Agency: "fr.insee",
            ID: "grp-1",
            Label: [{ "@language": "fr-FR", "@value": "Liste groupe" }],
            Code: [
              { ID: "code-1", Value: { StringValue: "01" }, CategoryReference: { ID: "cat-1" } },
            ],
          },
        ],
        Category: [{ ID: "cat-1", Label: [{ "@language": "fr-FR", "@value": "Agriculture" }] }],
      };
      const idleResult = { data: undefined, isLoading: false, isSuccess: false, error: null };
      const successResult = { data: groupData, isLoading: false, isSuccess: true, error: null };
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) =>
        agency === "fr.insee" && id === "grp-1" ? successResult : idleResult,
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
        target: { value: "fr.insee-grp-1" },
      });

      // The reused list is now displayed with its codes
      expect(
        (screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[]).some(
          (i) => i.value === "01",
        ),
      ).toBe(true);

      mockOnChange.mockClear();

      // Clicking "Créer une nouvelle liste" should wipe the reused list and start fresh
      fireEvent.click(screen.getByText("Créer une nouvelle liste"));

      // The reuse dropdown is gone and the reused code is no longer present
      expect(screen.queryByTestId("codes-list-dropdown")).not.toBeInTheDocument();
      const valueInputs = screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[];
      expect(valueInputs.some((i) => i.value === "01")).toBe(false);
      expect(valueInputs.every((i) => i.value === "")).toBe(true);

      // The label is reset and onChange notifies the parent with a brand new empty code list
      const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
      expect(labelInput.value).toBe("");

      const lastCall = mockOnChange.mock.calls.at(-1);
      const [newRepresentation, newCodeList] = lastCall as [
        CodeRepresentationType,
        CodeList,
        Category[],
      ];
      expect(newRepresentation.CodeListReference?.ID).not.toBe("grp-1");
      expect(newCodeList.Code?.every((c) => c.Value?.StringValue === "")).toBe(true);
    });

    it("should reset codes when create new list is clicked while already editing a list", () => {
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

      // The existing list shows its code with value "1"
      expect(
        (screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[]).some(
          (i) => i.value === "1",
        ),
      ).toBe(true);

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));

      const valueInputs = screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[];
      expect(valueInputs.some((i) => i.value === "1")).toBe(false);
      expect(valueInputs.every((i) => i.value === "")).toBe(true);
    });
  });

  describe("re-selection of an already loaded list", () => {
    it("should display the codes again when re-selecting a previously selected list", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [
          { id: "mut-1", label: "Liste 1", agencyId: "fr.insee", mutualized: true },
          { id: "mut-2", label: "Liste 2", agencyId: "fr.insee", mutualized: true },
        ],
        isLoading: false,
        error: null,
      });

      const codesByList: Record<string, { value: string; label: string }> = {
        "mut-1": { value: "01", label: "Agriculture" },
        "mut-2": { value: "02", label: "Industrie" },
      };
      const idleResult = { data: undefined, isLoading: false, isSuccess: false, error: null };
      // Références mémoïsées par liste : react-query renvoie un objet stable depuis son cache.
      // Sans cela, un nouvel objet à chaque rendu ferait boucler l'effet de chargement.
      const successCache: Record<string, any> = {};
      const buildSuccess = (id: string) => {
        if (!successCache[id]) {
          successCache[id] = {
            data: {
              CodeList: [
                {
                  Agency: "fr.insee",
                  ID: id,
                  Label: [{ "@language": "fr-FR", "@value": id }],
                  Code: [
                    {
                      ID: `code-${id}`,
                      Value: { StringValue: codesByList[id].value },
                      CategoryReference: { ID: `cat-${id}` },
                    },
                  ],
                },
              ],
              Category: [
                {
                  ID: `cat-${id}`,
                  Label: [{ "@language": "fr-FR", "@value": codesByList[id].label }],
                },
              ],
            },
            isLoading: false,
            isSuccess: true,
            error: null,
          };
        }
        return successCache[id];
      };

      // Simule le cache de react-query : tant qu'une liste n'a pas été "chargée", le hook
      // renvoie un état de chargement ; une fois chargée, il renvoie les données en synchrone
      // (comme un cache hit lors d'une re-sélection).
      const loadedKeys = new Set<string>();
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) => {
        if (!agency || !id) return idleResult;
        if (loadedKeys.has(`${agency}-${id}`)) return buildSuccess(id);
        return { data: undefined, isLoading: true, isSuccess: false, error: null };
      });

      const StatefulHarness = () => {
        const [rep, setRep] = useState<CodeRepresentationType | undefined>(undefined);
        return (
          <CodeRepresentation
            representation={rep}
            codeList={undefined}
            categories={[]}
            onChange={(r) => setRep(r)}
          />
        );
      };

      const { rerender } = render(<StatefulHarness />);

      fireEvent.click(screen.getByText("Réutiliser"));

      const select = (id: string) => {
        fireEvent.change(screen.getByTestId("codes-list-dropdown"), {
          target: { value: `fr.insee-${id}` },
        });
        // Simule la résolution du fetch (puis cache hit pour les sélections suivantes)
        loadedKeys.add(`fr.insee-${id}`);
        rerender(<StatefulHarness />);
      };

      const hasValue = (v: string) =>
        (screen.queryAllByPlaceholderText("Valeur") as HTMLInputElement[]).some(
          (i) => i.value === v,
        );

      select("mut-1");
      expect(hasValue("01")).toBe(true);

      select("mut-2");
      expect(hasValue("02")).toBe(true);

      // Re-sélection d'une liste déjà chargée : les codes doivent réapparaître
      select("mut-1");
      expect(hasValue("01")).toBe(true);
    });
  });

  describe("selection of a group list", () => {
    it("should fetch and display codes editable after selecting a group (non-mutualized) list", () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [{ id: "grp-1", label: "Liste groupe", agencyId: "fr.insee", mutualized: false }],
        isLoading: false,
        error: null,
      });

      const groupData = {
        CodeList: [
          {
            Agency: "fr.insee",
            ID: "grp-1",
            Label: [{ "@language": "fr-FR", "@value": "Liste groupe" }],
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
        data: groupData,
        isLoading: false,
        isSuccess: true,
        error: null,
      };
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) =>
        agency === "fr.insee" && id === "grp-1" ? successResult : idleResult,
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
        target: { value: "fr.insee-grp-1" },
      });

      const valueInputs = screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[];
      const labelInputs = screen.getAllByPlaceholderText("Libellé") as HTMLInputElement[];
      expect(valueInputs.some((i) => i.value === "01")).toBe(true);
      expect(labelInputs.some((i) => i.value === "Agriculture")).toBe(true);
      // editable mode: "Ajouter un code" button is present and inputs are not read-only
      expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
      expect(valueInputs.every((i) => !i.hasAttribute("readOnly"))).toBe(true);
    });
  });
});
