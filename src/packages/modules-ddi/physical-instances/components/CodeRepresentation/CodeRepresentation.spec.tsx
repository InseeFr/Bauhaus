import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
import { CodeRepresentation } from "./CodeRepresentation";
import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Category,
  CategoryUsage,
  CodeListUsage,
} from "../../types/api";
import { envelope } from "../../types/ddi4Items.testing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    // Les clés avec interpolation renvoient `clé|{options}` pour pouvoir vérifier les valeurs.
    t: (key: string, options?: Record<string, unknown>) => {
      if (options) {
        return `${key}|${JSON.stringify(options)}`;
      }
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
        "physicalInstance.view.code.categoryUsage.menuEntry": "Utilisation",
        "physicalInstance.view.code.categoryUsage.empty":
          "Cette catégorie n'est utilisée nulle part",
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
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : ""} {...props}>
      {children}
    </a>
  ),
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

const mockUseCodeListUsers = vi.fn(() => ({
  data: [] as any[],
  isLoading: false,
  isError: false,
}));

const mockFetchCodeListUsers = vi.fn(
  (_agencyId: string, _id: string): Promise<any[]> => Promise.resolve([]),
);
vi.mock("../../../hooks/useCodeListUsers", () => ({
  useCodeListUsers: () => mockUseCodeListUsers(),
  useFetchCodeListUsers: () => mockFetchCodeListUsers,
}));

const mockFetchCategoryUsers = vi.fn(
  (_agencyId: string, _id: string): Promise<any[]> => Promise.resolve([]),
);
const mockUseCategoryUsers = vi.fn((_agencyId: string, _id: string, _enabled?: boolean) => ({
  data: [] as any[],
  isLoading: false,
  isError: false,
}));
vi.mock("../../../hooks/useCategoryUsers", () => ({
  useFetchCategoryUsers: () => mockFetchCategoryUsers,
  useCategoryUsers: (agencyId: string, id: string, enabled?: boolean) =>
    mockUseCategoryUsers(agencyId, id, enabled),
}));

/**
 * La confirmation d'édition partagée est une `<Dialog>` contrôlée, rendue dans l'arbre React :
 * les tests la pilotent donc par le DOM (cliquer les vrais boutons du pied de page) plutôt qu'en
 * inspectant les options d'un appel impératif.
 */
const overrideDialog = () => screen.queryByRole("dialog");
const inOverrideDialog = () => within(screen.getByRole("dialog"));

/**
 * Les deux issues sont des cartes cliquables ; seul « Annuler » est un bouton de pied de page.
 */
const clickDialogAction = (keyBase: string, action: "confirm" | "variant" | "cancel") => {
  if (action === "cancel") {
    fireEvent.click(inOverrideDialog().getByText("physicalInstance.view.code.override.cancel"));
    return;
  }
  const labelKey = action === "variant" ? `${keyBase}.variantLabel` : `${keyBase}.overwriteLabel`;
  fireEvent.click(inOverrideDialog().getByText(labelKey).closest("button")!);
};

const OVERRIDE_SHARED = "physicalInstance.view.code.overrideShared";
const OVERRIDE_SHARED_CATEGORY = "physicalInstance.view.code.overrideSharedCategory";
const OVERRIDE_CATEGORY = "physicalInstance.view.code.overrideCategory";

const waitForDialog = (keyBase: string) =>
  waitFor(() => expect(screen.getByText(`${keyBase}.title`)).toBeInTheDocument());

/**
 * Édite un champ comme le ferait un utilisateur. La frappe suffit : c'est elle qui déclenche la
 * garde, sans qu'il ait à quitter le champ.
 */
const editField = (input: HTMLElement, value: string) => {
  fireEvent.change(input, { target: { value } });
};

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

// Contenu du menu contextuel rendu en ligne, pour pouvoir cliquer ses entrées sans overlay réel.
vi.mock("primereact/overlaypanel", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");
  return {
    OverlayPanel: forwardRef(({ children }: any, ref: any) => {
      useImperativeHandle(ref, () => ({ toggle: () => {}, hide: () => {} }));
      return <div>{children}</div>;
    }),
  };
});

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

  /**
   * La frappe est appliquée immédiatement (l'utilisateur voit ce qu'il tape) : c'est donc le
   * DERNIER appel qui porte l'état retenu une fois la décision prise.
   */
  const lastChange = () => mockOnChange.mock.calls.at(-1)!;

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
    mockFetchCategoryUsers.mockResolvedValue([]);
    mockFetchCodeListUsers.mockResolvedValue([]);
    mockUseCategoryUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
    mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
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
    it("should call onChange when label is updated", async () => {
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

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
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

    it("should preserve label when codeList content changes but ID stays the same", async () => {
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
      // La garde (asynchrone) doit avoir appliqué l'édition avant le rerender.
      await waitFor(() => expect(mockOnChange).toHaveBeenCalled());

      // Simuler une mise à jour du codeList avec le même ID (comme lors de l'ajout d'un code)
      const updatedCodeList: CodeList = {
        ...mockCodeList,
        Code: [
          ...(mockCodeList.Code ?? []),
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
    it("should preserve label when adding a code", async () => {
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
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));

      // Ajouter un code
      const addButton = screen.getByText("Ajouter un code");
      fireEvent.click(addButton);

      // Vérifier que onChange a été appelé avec le label préservé
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(2));
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          Label: [{ "@language": "fr-FR", "@value": "Mon label" }],
        }),
        expect.anything(),
      );
    });

    it("should preserve label when editing a code value", async () => {
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
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));

      mockOnChange.mockClear();

      // Modifier un code (via l'input dans le tableau)
      const codeInputs = screen.getAllByPlaceholderText("Valeur");
      fireEvent.change(codeInputs[0], { target: { value: "10" } });

      // Vérifier que onChange a été appelé avec le label préservé
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
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

      const mutualizedData = envelope({
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
      });
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

      const groupData = envelope({
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
      });
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
            data: envelope({
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
            }),
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

      const groupData = envelope({
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
      });
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

    it("keeps the referenced ID and existing codes when editing the label of a reused group list", async () => {
      mockUseAllCodesLists.mockReturnValue({
        data: [{ id: "grp-1", label: "Liste groupe", agencyId: "fr.insee", mutualized: false }],
        isLoading: false,
        error: null,
      });
      const groupData = envelope({
        CodeList: [
          {
            Agency: "fr.insee",
            ID: "grp-1",
            Label: [{ "@language": "fr-FR", "@value": "Liste groupe" }],
            Code: [
              { ID: "code-1", Value: { StringValue: "01" }, CategoryReference: { ID: "cat-1" } },
              { ID: "code-2", Value: { StringValue: "02" }, CategoryReference: { ID: "cat-2" } },
            ],
          },
        ],
        Category: [
          { ID: "cat-1", Label: [{ "@language": "fr-FR", "@value": "Agriculture" }] },
          { ID: "cat-2", Label: [{ "@language": "fr-FR", "@value": "Industrie" }] },
        ],
      });
      mockUseMutualizedCodesList.mockImplementation((agency: string, id: string) =>
        agency === "fr.insee" && id === "grp-1"
          ? { data: groupData, isLoading: false, isSuccess: true, error: null }
          : { data: undefined, isLoading: false, isSuccess: false, error: null },
      );

      // Harnais qui re-injecte les résultats de onChange comme props, comme le fait le vrai
      // VariableEditForm. Sans cela, l'édition d'une liste réutilisée part d'un codeList
      // toujours `undefined`.
      let last: [CodeRepresentationType | undefined, CodeList | undefined, Category[] | undefined] =
        [undefined, undefined, []];
      const Harness = () => {
        const [rep, setRep] = useState<CodeRepresentationType | undefined>(undefined);
        const [cl, setCl] = useState<CodeList | undefined>(undefined);
        const [cats, setCats] = useState<Category[] | undefined>([]);
        return (
          <CodeRepresentation
            representation={rep}
            codeList={cl}
            categories={cats}
            onChange={(r, c, k) => {
              last = [r, c, k];
              setRep(r);
              setCl(c);
              setCats(k);
            }}
          />
        );
      };
      render(<Harness />);

      fireEvent.click(screen.getByText("Réutiliser"));
      fireEvent.change(screen.getByTestId("codes-list-dropdown"), {
        target: { value: "fr.insee-grp-1" },
      });

      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.change(labelInput, { target: { value: "Libellé surchargé" } });
      // La garde (asynchrone) applique l'édition dans une microtâche.
      await waitFor(() => expect(last[1]?.Label?.[0]?.["@value"]).toBe("Libellé surchargé"));

      const [rep, cl] = last;
      // La représentation ET la liste de codes doivent rester sur l'ID de la liste partagée…
      expect(rep?.CodeListReference?.ID).toBe("grp-1");
      expect(cl?.ID).toBe("grp-1");
      // …le nouveau libellé est appliqué…
      expect(cl?.Label?.[0]?.["@value"]).toBe("Libellé surchargé");
      // …et les codes existants ne sont pas perdus.
      expect(cl?.Code?.map((c) => c.Value?.StringValue)).toEqual(["01", "02"]);
    });
  });

  describe("confirmation before overriding a shared code list", () => {
    const otherVariableUsage: CodeListUsage = {
      studyUnitAgencyId: "fr.insee",
      studyUnitId: "su-1",
      studyUnitLabel: "Recensement",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      physicalInstanceLabel: "Fichier détail",
      variableAgencyId: "fr.insee",
      variableId: "other-variable",
      variableLabel: "Autre variable",
    };

    // Le composant lit les usages via le hook (affichage) ET via le fetch impératif (gardes) :
    // on aligne les deux mocks.
    const markListAsShared = () => {
      mockUseCodeListUsers.mockReturnValue({
        data: [otherVariableUsage],
        isLoading: false,
        isError: false,
      });
      mockFetchCodeListUsers.mockResolvedValue([otherVariableUsage]);
    };

    const renderShared = (currentVariableId = "current-variable") =>
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          currentVariableId={currentVariableId}
          currentVariableName="Client"
          onChange={mockOnChange}
        />,
      );

    it("asks from the very first keystroke, without waiting for the field to be left", async () => {
      // Régression : la popup n'apparaissait qu'à la sortie du champ. Elle est demandée dès la
      // frappe — mais sur une modification DÉJÀ appliquée, si bien que le caractère saisi reste
      // affiché au lieu d'être avalé comme il l'était à l'origine.
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      fireEvent.change(valueInput, { target: { value: "10" } });

      expect(lastChange()[1].Code[0].Value.StringValue).toBe("10");
      expect(valueInput).toHaveValue("10");
      await waitForDialog(OVERRIDE_SHARED);
    });

    it("asks for confirmation even when the usages are not loaded at render time yet", async () => {
      // Régression : juste après l'ouverture de l'onglet, la requête des usages peut ne pas
      // avoir encore répondu — la garde doit interroger elle-même les usages avant de décider,
      // sinon la 1re frappe écrase la liste partagée sans confirmation.
      mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: true, isError: false });
      mockFetchCodeListUsers.mockResolvedValue([otherVariableUsage]);
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");

      await waitForDialog(OVERRIDE_SHARED);
    });

    it("creates a variant of the shared list when choosing Créer (case 1)", async () => {
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);

      clickDialogAction(OVERRIDE_SHARED, "variant");

      // La popup se ferme et la modification est reportée sur une NOUVELLE liste.
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      const [rep, variant, categories] = lastChange();
      expect(variant.ID).not.toBe("codelist-1");
      expect(variant.Version).toBe("1");
      // La représentation bascule sur la variante.
      expect(rep.CodeListReference.ID).toBe(variant.ID);
      // La variante référence la liste d'origine via l'attribut DDI BasedOn.
      expect(variant.BasedOnObject).toMatchObject({
        $type: "BasedOnObjectType",
        BasedOnReference: [
          expect.objectContaining({ URN: "urn:ddi:fr.insee:codelist-1:1", ID: "codelist-1" }),
        ],
      });
      // L'édition en attente est incluse dans la variante (codes ré-identifiés)…
      expect(variant.Code[0].Value.StringValue).toBe("10");
      expect(variant.Code[0].ID).not.toBe("code-1");
      // …et les catégories restent les items partagés.
      expect(categories[0].ID).toBe("category-1");
      expect(variant.Code[0].CategoryReference.ID).toBe("category-1");
    });

    it("applies the change once the user confirms (Modifier)", async () => {
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);

      clickDialogAction(OVERRIDE_SHARED, "confirm");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          Code: expect.arrayContaining([expect.objectContaining({ Value: { StringValue: "10" } })]),
        }),
        expect.anything(),
      );
    });

    it("shows the code list users block inside the confirmation dialog", async () => {
      // Le contenu détaillé de la popup est couvert par OverrideDialog.spec : on vérifie ici
      // qu'elle reçoit bien les usages résolus par la garde.
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);

      const dialog = inOverrideDialog();
      expect(
        dialog.getByText(
          'physicalInstance.view.code.overrideShared.message|{"label":"Liste de codes test","count":1,"firstOther":"Autre variable"}',
        ),
      ).toBeInTheDocument();
      fireEvent.click(dialog.getByText("physicalInstance.view.code.usersPanel.title"));
      await waitFor(() =>
        expect(dialog.getByRole("link", { name: "Autre variable" })).toBeInTheDocument(),
      );
    });

    it("does not ask again after the first confirmation in the same editing session", async () => {
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);
      clickDialogAction(OVERRIDE_SHARED, "confirm");
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());

      mockOnChange.mockClear();
      editField(valueInput, "11");

      // La 2e édition passe directement, sans rouvrir de popup.
      await waitFor(() => expect(lastChange()[1].Code[0].Value.StringValue).toBe("11"));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("restores the previous value when the user cancels", async () => {
      // La frappe étant appliquée au fil de l'eau, renoncer ne consiste pas à « ne rien faire »
      // mais à remettre le champ dans l'état où il était avant l'édition.
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);

      clickDialogAction(OVERRIDE_SHARED, "cancel");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      expect(lastChange()[1].Code[0].Value.StringValue).toBe("1");
      expect(valueInput).toHaveValue("1");
    });

    it("keeps warning that the list is shared once the confirmation was acknowledged", async () => {
      // L'acquittement vaut pour toute la session : sans rappel permanent, plus rien n'indique
      // que les modifications suivantes partent sur une liste utilisée par d'autres.
      markListAsShared();
      renderShared();

      const notice =
        'physicalInstance.view.code.sharedNotice.message|{"count":1,"firstOther":"Autre variable"}';
      expect(screen.getByText(notice)).toBeInTheDocument();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");
      await waitForDialog(OVERRIDE_SHARED);
      clickDialogAction(OVERRIDE_SHARED, "confirm");
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());

      expect(screen.getByText(notice)).toBeInTheDocument();
    });

    it("does not warn about sharing when the list belongs to this variable alone", () => {
      mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
      renderShared();

      expect(
        screen.queryByText(/physicalInstance\.view\.code\.sharedNotice\.message/),
      ).not.toBeInTheDocument();
    });

    it("does not ask for confirmation when the list is not shared with other variables", async () => {
      mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
      mockFetchCodeListUsers.mockResolvedValue([]);
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("does not ask for confirmation when the shared list is mutualized (read-only)", () => {
      markListAsShared();
      mockUseAllCodesLists.mockReturnValue({
        data: [
          { id: "codelist-1", label: "Liste mutualisée", agencyId: "fr.insee", mutualized: true },
        ],
        isLoading: false,
        error: null,
      });

      renderShared();

      // Liste mutualisée → lecture seule : un changement de label ne déclenche pas de confirmation.
      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      fireEvent.change(labelInput, { target: { value: "Tentative" } });

      expect(overrideDialog()).not.toBeInTheDocument();
    });
  });

  describe("confirmation before editing a shared category", () => {
    const otherVariableUsage: CodeListUsage = {
      studyUnitAgencyId: "fr.insee",
      studyUnitId: "su-1",
      studyUnitLabel: "Recensement",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      physicalInstanceLabel: "Fichier détail",
      variableAgencyId: "fr.insee",
      variableId: "other-variable",
      variableLabel: "Autre variable",
    };

    const markListAsShared = () => {
      mockUseCodeListUsers.mockReturnValue({
        data: [otherVariableUsage],
        isLoading: false,
        isError: false,
      });
      mockFetchCodeListUsers.mockResolvedValue([otherVariableUsage]);
    };

    const markListAsNotShared = () => {
      mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
      mockFetchCodeListUsers.mockResolvedValue([]);
    };

    const categoryUsageRow = (overrides: Partial<CategoryUsage> = {}): CategoryUsage => ({
      group: { agencyId: "fr.insee", id: "grp-1", label: "Groupe démographie" },
      studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement" },
      physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
      variable: { agencyId: "fr.insee", id: "other-variable", label: "Autre variable" },
      codeList: { agencyId: "fr.insee", id: "cl-2", label: "Autre liste" },
      ...overrides,
    });

    const currentListUsage = (): CategoryUsage =>
      categoryUsageRow({
        variable: { agencyId: "fr.insee", id: "current-variable", label: "Client" },
        codeList: { agencyId: "fr.insee", id: "codelist-1", label: "Liste de codes test" },
      });

    // La catégorie est utilisée par la liste courante ET par une autre liste (via 2 variables) :
    // partagée — 3 lignes mais seulement 2 listes distinctes.
    const markCategoryAsShared = () =>
      mockFetchCategoryUsers.mockResolvedValue([
        currentListUsage(),
        categoryUsageRow(),
        categoryUsageRow({
          variable: { agencyId: "fr.insee", id: "third-variable", label: "Troisième variable" },
        }),
      ]);

    // La catégorie n'est utilisée que par la liste courante : non partagée.
    const markCategoryAsOwn = () => mockFetchCategoryUsers.mockResolvedValue([currentListUsage()]);

    const renderShared = () =>
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          currentVariableId="current-variable"
          currentVariableName="Client"
          onChange={mockOnChange}
        />,
      );

    const editCategoryLabel = (value: string) =>
      editField(screen.getAllByPlaceholderText("Libellé")[0], value);

    it("shows the combined list+category dialog when both are shared (case 2)", async () => {
      markListAsShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");

      await waitForDialog(OVERRIDE_SHARED_CATEGORY);

      const dialog = inOverrideDialog();
      // La popup cite la liste (N variables) puis la catégorie (N listes distinctes).
      expect(
        dialog.getByText(
          'physicalInstance.view.code.overrideShared.message|{"label":"Liste de codes test","count":1,"firstOther":"Autre variable"}',
        ),
      ).toBeInTheDocument();
      expect(
        dialog.getByText(
          'physicalInstance.view.code.overrideSharedCategory.categoryMessage|{"label":"Oui","count":1,"firstOther":"Autre liste"}',
        ),
      ).toBeInTheDocument();

      // Le panneau des listes utilisant la catégorie est présent, replié : l'arbre
      // Group > StudyUnit > Variable > CodeList n'apparaît qu'une fois déplié.
      expect(dialog.queryByText("Autre liste")).not.toBeInTheDocument();
      fireEvent.click(dialog.getByText("physicalInstance.view.code.categoryUsersPanel.title"));
      await waitFor(() => expect(dialog.getByText("Groupe démographie")).toBeInTheDocument());
      expect(dialog.getByText("Recensement")).toBeInTheDocument();
      // Le niveau PhysicalInstance figure entre l'unité d'enquête et les variables.
      expect(dialog.getByRole("link", { name: "Fichier détail" })).toBeInTheDocument();
      expect(dialog.getByRole("link", { name: "Autre variable" })).toBeInTheDocument();
      expect(dialog.getByRole("link", { name: "Troisième variable" })).toBeInTheDocument();
      // La liste apparaît sous chacune des deux variables qui l'utilisent.
      expect(dialog.getAllByText("Autre liste")).toHaveLength(2);
      // La liste en cours d'édition figure aussi dans l'arbre : le panneau montre TOUTES les
      // listes qui utilisent la catégorie.
      expect(dialog.getByText("Liste de codes test")).toBeInTheDocument();
    });

    it("applies the category edit once confirmed and does not ask again (case 2)", async () => {
      markListAsShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_SHARED_CATEGORY);

      clickDialogAction(OVERRIDE_SHARED_CATEGORY, "confirm");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.arrayContaining([
          expect.objectContaining({
            Label: expect.arrayContaining([
              expect.objectContaining({ "@value": "Europe modifiée" }),
            ]),
          }),
        ]),
      );

      // Liste et catégorie acquittées : la 2e édition passe directement.
      mockOnChange.mockClear();
      editCategoryLabel("Europe 2");
      await waitFor(() => expect(lastChange()[2][0].Label[0]["@value"]).toBe("Europe 2"));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("shows the category-only dialog when the list is own but the category is shared (case 3)", async () => {
      markListAsNotShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");

      await waitForDialog(OVERRIDE_CATEGORY);

      const dialog = inOverrideDialog();
      // « Cette liste est propre à la variable Client. En revanche, la catégorie… »
      expect(
        dialog.getByText(
          'physicalInstance.view.code.overrideCategory.ownListMessage|{"variable":"Client"}',
        ),
      ).toBeInTheDocument();
      expect(
        dialog.getByText(
          'physicalInstance.view.code.overrideCategory.categoryMessage|{"label":"Oui","count":1,"firstOther":"Autre liste"}',
        ),
      ).toBeInTheDocument();
      // La liste étant propre à la variable, son panneau « Utilisée par » n'a pas lieu d'être.
      expect(
        dialog.queryByText("physicalInstance.view.code.usersPanel.title"),
      ).not.toBeInTheDocument();
      expect(
        dialog.getByText("physicalInstance.view.code.categoryUsersPanel.title"),
      ).toBeInTheDocument();

      // La confirmation applique l'édition.
      clickDialogAction(OVERRIDE_CATEGORY, "confirm");
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
    });

    it("shows the combined dialog for a category edit of a shared list even when the category is only used by this list (case 2)", async () => {
      // Une variante de la liste seule ne suffirait pas : la catégorie resterait partagée entre
      // l'originale et la variante. La popup combinée s'affiche donc dès que la liste est
      // partagée, quel que soit le nombre de listes utilisant la catégorie.
      markListAsShared();
      markCategoryAsOwn();
      renderShared();

      editCategoryLabel("Oui modifié");

      await waitForDialog(OVERRIDE_SHARED_CATEGORY);
      const dialog = inOverrideDialog();
      // Le choix porte bien sur les deux (forker la seule liste laisserait la catégorie
      // partagée entre l'originale et la variante)…
      expect(
        dialog.getByText("physicalInstance.view.code.overrideSharedCategory.variantLabel"),
      ).toBeInTheDocument();
      // …mais aucune AUTRE liste n'utilise la catégorie : rien à annoncer à son sujet, plutôt
      // qu'une phrase parlant de « 0 autres listes de codes ».
      expect(dialog.queryByText(/overrideSharedCategory\.categoryMessage/)).not.toBeInTheDocument();
    });

    it("lets the user edit the category again after cancelling (case 3)", async () => {
      // Régression : après « Annuler », le champ restait gelé et plus aucune frappe n'était prise
      // en compte — renoncer à UNE édition ne doit pas fermer l'édition de la catégorie.
      markListAsNotShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_CATEGORY);
      clickDialogAction(OVERRIDE_CATEGORY, "cancel");
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());

      const labelInput = screen.getAllByPlaceholderText("Libellé")[0];
      expect(labelInput).toHaveValue("Oui");
      expect(labelInput).not.toHaveAttribute("readonly");

      // Nouvelle tentative : la popup revient, et confirmer applique bien l'édition.
      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_CATEGORY);
      clickDialogAction(OVERRIDE_CATEGORY, "confirm");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      expect(lastChange()[2][0].Label[0]["@value"]).toBe("Europe modifiée");
    });

    it("creates a variant of the category when choosing Créer (case 3)", async () => {
      markListAsNotShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_CATEGORY);

      clickDialogAction(OVERRIDE_CATEGORY, "variant");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      const [, codeList, categories] = lastChange();

      // La liste garde son identité (elle est propre à la variable) …
      expect(codeList.ID).toBe("codelist-1");
      // … la catégorie est forkée, avec le libellé édité et le lien DDI vers l'originale.
      const variant = categories.find((cat: any) => cat.ID !== "category-1");
      expect(variant).toBeDefined();
      expect(variant.Label[0]["@value"]).toBe("Europe modifiée");
      expect(variant.BasedOnObject).toMatchObject({
        BasedOnReference: [expect.objectContaining({ ID: "category-1", $type: "Category" })],
      });
      // La catégorie partagée d'origine n'est plus portée par la variable.
      expect(categories.some((cat: any) => cat.ID === "category-1")).toBe(false);
      // Le code pointe désormais sur la variante.
      expect(codeList.Code[0].CategoryReference.ID).toBe(variant.ID);
    });

    it("does not ask again after creating a category variant", async () => {
      // Regression : le choix « Créer » n'acquittait rien, la popup revenait a chaque frappe.
      markListAsNotShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_CATEGORY);
      clickDialogAction(OVERRIDE_CATEGORY, "variant");
      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());

      editCategoryLabel("Europe modifiée encore");

      // La variante n'appartient qu'à cette variable : plus rien à confirmer, l'édition passe.
      await waitFor(() =>
        expect(screen.getAllByPlaceholderText("Libellé")[0]).toHaveValue("Europe modifiée encore"),
      );
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("keeps the BasedOn link when the freshly created variant is edited again", async () => {
      // Regression : les frappes suivantes reconstruisaient la categorie a partir de zero et
      // perdaient le lien DDI vers la categorie d'origine. Harnais qui re-injecte les resultats
      // de onChange comme props, comme le fait le vrai VariableEditForm.
      markListAsNotShared();
      markCategoryAsShared();

      let last: [any, CodeList | undefined, Category[] | undefined] = [undefined, undefined, []];
      const Harness = () => {
        const [rep, setRep] = useState<any>(mockRepresentation);
        const [cl, setCl] = useState<CodeList | undefined>(mockCodeList);
        const [cats, setCats] = useState<Category[] | undefined>(mockCategories);
        return (
          <CodeRepresentation
            representation={rep}
            codeList={cl}
            categories={cats}
            currentVariableId="current-variable"
            currentVariableName="Client"
            onChange={(r, c, k) => {
              last = [r, c, k];
              setRep(r);
              setCl(c);
              setCats(k);
            }}
          />
        );
      };
      render(<Harness />);

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_CATEGORY);
      clickDialogAction(OVERRIDE_CATEGORY, "variant");
      await waitFor(() => expect(last[2]?.some((cat) => cat.ID !== "category-1")).toBe(true));

      editCategoryLabel("Europe encore modifiée");

      await waitFor(() => {
        const variant = last[2]?.find((cat) => cat.ID !== "category-1");
        expect(variant?.Label?.[0]?.["@value"]).toBe("Europe encore modifiée");
      });
      const variant = last[2]!.find((cat) => cat.ID !== "category-1")!;
      // Le lien DDI vers la categorie d'origine survit aux frappes suivantes.
      expect(variant.BasedOnObject).toMatchObject({
        BasedOnReference: [expect.objectContaining({ ID: "category-1" })],
      });
    });

    it("creates a variant of both the list and the category when choosing Créer (case 2)", async () => {
      markListAsShared();
      markCategoryAsShared();
      renderShared();

      editCategoryLabel("Europe modifiée");
      await waitForDialog(OVERRIDE_SHARED_CATEGORY);

      clickDialogAction(OVERRIDE_SHARED_CATEGORY, "variant");

      await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
      const [rep, codeList, categories] = lastChange();
      // La liste ET la catégorie sont forkées.
      expect(codeList.ID).not.toBe("codelist-1");
      expect(codeList.BasedOnObject.BasedOnReference[0].ID).toBe("codelist-1");
      expect(rep.CodeListReference.ID).toBe(codeList.ID);
      const variant = categories.find((cat: any) => cat.ID !== "category-1");
      expect(variant.BasedOnObject.BasedOnReference[0].ID).toBe("category-1");
      expect(codeList.Code[0].CategoryReference.ID).toBe(variant.ID);
    });

    it("shows the list dialog for a category edit when the category has no known usage yet (case 1)", async () => {
      // Catégorie encore inconnue de Colectica (jamais sauvegardée) : seule la liste partagée
      // est en jeu, on retombe sur la popup liste.
      markListAsShared();
      mockFetchCategoryUsers.mockResolvedValue([]);
      renderShared();

      editCategoryLabel("Oui modifié");

      await waitForDialog(OVERRIDE_SHARED);
    });

    it("applies a category edit directly when neither the list nor the category is shared (case 4)", async () => {
      markListAsNotShared();
      markCategoryAsOwn();
      renderShared();

      editCategoryLabel("Oui modifié");

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("does not query category usages for a code value edit", () => {
      markListAsShared();
      renderShared();

      const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
      editField(valueInput, "10");

      expect(mockFetchCategoryUsers).not.toHaveBeenCalled();
    });

    it("falls back to the list-level guard when category usages cannot be fetched", async () => {
      markListAsNotShared();
      mockFetchCategoryUsers.mockRejectedValue(new Error("Colectica error"));
      renderShared();

      editCategoryLabel("Oui modifié");

      // Impossible de savoir si la catégorie est partagée : on retombe sur la garde liste,
      // qui laisse passer puisque la liste n pas partagée.
      await waitFor(() => expect(lastChange()[2][0].Label[0]["@value"]).toBe("Oui modifié"));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("falls back to the list dialog when category usages cannot be fetched and the list is shared", async () => {
      markListAsShared();
      mockFetchCategoryUsers.mockRejectedValue(new Error("Colectica error"));
      renderShared();

      editCategoryLabel("Oui modifié");

      // Usages de la catégorie inconnus : on ne fabrique pas une popup combinée avec un compte
      // faux, on affiche la popup liste (la liste partagée reste le risque avéré).
      await waitForDialog(OVERRIDE_SHARED);
    });
  });

  describe("category usage popup", () => {
    const renderWithCodeList = () =>
      render(
        <CodeRepresentation
          representation={mockRepresentation}
          codeList={mockCodeList}
          categories={mockCategories}
          onChange={mockOnChange}
        />,
      );

    it("does not load the category usages before the popup is opened", () => {
      renderWithCodeList();

      expect(mockUseCategoryUsers).toHaveBeenCalledWith("", "", false);
    });

    it("opens the usages of the category of the clicked row", async () => {
      mockUseCategoryUsers.mockReturnValue({
        data: [
          {
            group: { agencyId: "fr.insee", id: "grp-1", label: "Recensement" },
            studyUnit: { agencyId: "fr.insee", id: "su-1", label: "Recensement 2024" },
            physicalInstance: { agencyId: "fr.insee", id: "pi-1", label: "Fichier détail" },
            variable: { agencyId: "fr.insee", id: "other-variable", label: "Autre variable" },
            codeList: { agencyId: "fr.insee", id: "other-list", label: "Autre liste" },
          },
        ],
        isLoading: false,
        isError: false,
      });
      renderWithCodeList();

      fireEvent.click(screen.getByText("Utilisation"));

      // La popup est ouverte sur la catégorie de la ligne, et son arbre est déplié d'emblée.
      expect(mockUseCategoryUsers).toHaveBeenCalledWith("fr.insee", "category-1", true);
      expect(
        screen.getByText('physicalInstance.view.code.categoryUsage.title|{"label":"Oui"}'),
      ).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText("Autre liste")).toBeInTheDocument());
    });

    it("does not guard the popup behind the shared-edition confirmation", () => {
      renderWithCodeList();

      fireEvent.click(screen.getByText("Utilisation"));

      // Consulter les utilisations ne modifie rien : aucune popup de confirmation, aucun onChange.
      expect(
        screen.queryByText("physicalInstance.view.code.overrideShared.title"),
      ).not.toBeInTheDocument();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
