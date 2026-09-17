import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { useState } from "react";
import type { ComponentProps } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import type {
  CodeRepresentation as CodeRepresentationType,
  CodeList,
  Category,
} from "../../types/api";
import { envelope } from "../../types/ddi4Items.testing";
import { CodeRepresentation } from "./CodeRepresentation";
import {
  categoryUsage,
  otherVariableCategoryUsage,
  recensementCodeListUsage,
} from "./usages.testing";

type CodeRepresentationProps = ComponentProps<typeof CodeRepresentation>;

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
        "physicalInstance.view.code.loadingCodeLists": "Chargement des listes de codes...",
        "physicalInstance.view.code.errorLoadingCodeLists":
          "Erreur lors du chargement des listes de codes",
        "physicalInstance.view.code.noCodeListsAvailable": "Aucune liste de codes disponible",
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

vi.mock("react-router-dom", () => import("./reactRouter.testing"));

const mockUseAllCodeLists = vi.fn(() => ({
  data: [
    { id: "list-1", label: "Liste 1", agencyId: "fr.insee", mutualized: false },
    { id: "list-2", label: "Liste 2", agencyId: "fr.insee", mutualized: false },
  ],
  isLoading: false,
  error: null,
}));

vi.mock("../../../hooks/useAllCodeLists", () => ({
  useAllCodeLists: () => mockUseAllCodeLists(),
}));

const mockUseMutualizedCodeList = vi.fn((_agency: string, _id: string) => ({
  data: undefined as any,
  isLoading: false,
  isSuccess: false,
  error: null,
}));

vi.mock("../../../hooks/useMutualizedCodeList", () => ({
  useMutualizedCodeList: (agency: string, id: string) => mockUseMutualizedCodeList(agency, id),
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

/** Choisit une issue de la popup et attend sa fermeture. */
const resolveDialog = async (keyBase: string, action: "confirm" | "variant" | "cancel") => {
  clickDialogAction(keyBase, action);
  await waitFor(() => expect(overrideDialog()).not.toBeInTheDocument());
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

/** Édite la valeur du premier code et renvoie son champ. */
const editFirstValue = (value: string) => {
  const valueInput = screen.getAllByPlaceholderText("Valeur")[0];
  editField(valueInput, value);
  return valueInput;
};

const editListLabel = (value: string) =>
  editField(screen.getByLabelText("Libellé de la liste de codes"), value);

const valueInputs = () => screen.getAllByPlaceholderText("Valeur") as HTMLInputElement[];

/** Réponse de `useAllCodeLists` : les listes proposées à la réutilisation. */
const mockAllCodeLists = (data: { id: string; label: string; mutualized: boolean }[]) =>
  mockUseAllCodeLists.mockReturnValue({
    data: data.map(({ id, label, mutualized }) => ({
      id,
      label,
      agencyId: "fr.insee",
      mutualized,
    })),
    isLoading: false,
    error: null,
  });

const idleResult = { data: undefined as any, isLoading: false, isSuccess: false, error: null };
const successResult = (data: unknown) => ({
  data,
  isLoading: false,
  isSuccess: true,
  error: null,
});

/** `useMutualizedCodeList` renvoie `result` pour la liste `fr.insee/id`, un état inactif sinon. */
const mockReusableCodeList = (id: string, result: unknown) =>
  mockUseMutualizedCodeList.mockImplementation((agency: string, requestedId: string) =>
    agency === "fr.insee" && requestedId === id ? (result as typeof idleResult) : idleResult,
  );

/** Ouvre la réutilisation et sélectionne la liste `fr.insee/id`. */
const reuseCodeList = (id: string) => {
  fireEvent.click(screen.getByText("Réutiliser"));
  fireEvent.change(screen.getByTestId("code-list-dropdown"), {
    target: { value: `fr.insee-${id}` },
  });
};

const fr = (value: string) => [{ "@language": "fr-FR", "@value": value }];

/** Liste de codes chargée depuis Colectica : chaque code pointe sur sa propre catégorie. */
const reusedCodeList = (
  id: string,
  label: string,
  codes: { id: string; value: string; categoryId: string; category: string }[] = [
    { id: "code-1", value: "01", categoryId: "cat-1", category: "Agriculture" },
  ],
) =>
  envelope({
    CodeList: [
      {
        Agency: "fr.insee",
        ID: id,
        Label: fr(label),
        Code: codes.map((code) => ({
          ID: code.id,
          Value: { StringValue: code.value },
          CategoryReference: { ID: code.categoryId },
        })),
      },
    ],
    Category: codes.map((code) => ({ ID: code.categoryId, Label: fr(code.category) })),
  });

/** Vérifie que le code réutilisé « 01 / Agriculture » est affiché ; renvoie les champs valeur. */
const expectReusedCodeDisplayed = () => {
  const values = valueInputs();
  const labelInputs = screen.getAllByPlaceholderText("Libellé") as HTMLInputElement[];
  expect(values.some((i) => i.value === "01")).toBe(true);
  expect(labelInputs.some((i) => i.value === "Agriculture")).toBe(true);
  return values;
};

/**
 * Harnais qui re-injecte les résultats de onChange comme props, comme le fait le vrai
 * VariableEditForm. Renvoie un objet dont `last` porte les arguments du dernier onChange.
 */
const renderHarness = (
  initial: Pick<CodeRepresentationProps, "representation" | "codeList" | "categories">,
  props: Partial<CodeRepresentationProps> = {},
) => {
  const changes: { last: [any, CodeList | undefined, Category[] | undefined] } = {
    last: [undefined, undefined, []],
  };
  const Harness = () => {
    const [rep, setRep] = useState<any>(initial.representation);
    const [cl, setCl] = useState<CodeList | undefined>(initial.codeList);
    const [cats, setCats] = useState<Category[] | undefined>(initial.categories);
    return (
      <CodeRepresentation
        {...props}
        representation={rep}
        codeList={cl}
        categories={cats}
        onChange={(r, c, k) => {
          changes.last = [r, c, k];
          setRep(r);
          setCl(c);
          setCats(k);
        }}
      />
    );
  };
  render(<Harness />);
  return changes;
};

vi.mock("primereact/inputtext", () => import("./primereact.testing"));

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

vi.mock("primereact/overlaypanel", () => import("./primereact.testing"));

vi.mock("primereact/column", () => import("./primereact.testing"));

vi.mock("primereact/progressspinner", () => import("./primereact.testing"));

vi.mock("primereact/message", () => import("./primereact.testing"));

vi.mock("primereact/dropdown", () => import("./primereact.testing"));

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

  /** Le composant sur la liste « Liste de codes test » (un code « 1 / Oui »). */
  const codeRepresentation = (props: Partial<CodeRepresentationProps> = {}) => (
    <CodeRepresentation
      representation={mockRepresentation}
      codeList={mockCodeList}
      categories={mockCategories}
      onChange={mockOnChange}
      {...props}
    />
  );

  const renderCodeRepresentation = (props: Partial<CodeRepresentationProps> = {}) =>
    render(codeRepresentation(props));

  /** Le composant sans aucune liste de codes. */
  const renderWithoutCodeList = () =>
    renderCodeRepresentation({ representation: undefined, codeList: undefined, categories: [] });

  // Le composant lit les usages via le hook (affichage) ET via le fetch impératif (gardes) :
  // on aligne les deux mocks.
  const otherVariableUsage = recensementCodeListUsage("other-variable", "Autre variable");

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

  const renderShared = () =>
    renderCodeRepresentation({
      currentVariableId: "current-variable",
      currentVariableName: "Client",
    });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchCategoryUsers.mockResolvedValue([]);
    mockFetchCodeListUsers.mockResolvedValue([]);
    mockUseCategoryUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
    mockUseCodeListUsers.mockReturnValue({ data: [], isLoading: false, isError: false });
    mockAllCodeLists([
      { id: "codelist-1", label: "Liste 1", mutualized: false },
      { id: "list-2", label: "Liste 2", mutualized: false },
    ]);
  });

  describe("initialization", () => {
    it("should render action buttons", () => {
      renderCodeRepresentation();

      expect(screen.getByText("Créer une nouvelle liste")).toBeInTheDocument();
      expect(screen.getByText("Réutiliser")).toBeInTheDocument();
    });

    it("should show DataTable when codeList has codes", () => {
      renderCodeRepresentation();

      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });

    it("should not show DataTable when codeList is undefined", () => {
      renderWithoutCodeList();

      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });

    it("should initialize label from codeList", () => {
      renderCodeRepresentation();

      const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
      expect(labelInput.value).toBe("Liste de codes test");
    });
  });

  describe("toggle between modes", () => {
    it("should show ReuseCodeListSelect when reuse button is clicked", () => {
      renderCodeRepresentation();

      expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Réutiliser"));

      expect(screen.getByTestId("code-list-dropdown")).toBeInTheDocument();
    });

    it("should keep ReuseCodeListSelect visible when reuse button is clicked again", () => {
      renderCodeRepresentation();

      const reuseButton = screen.getByText("Réutiliser");

      fireEvent.click(reuseButton);
      expect(screen.getByTestId("code-list-dropdown")).toBeInTheDocument();

      fireEvent.click(reuseButton);
      expect(screen.getByTestId("code-list-dropdown")).toBeInTheDocument();
    });

    it("should hide ReuseCodeListSelect when create new list is clicked", () => {
      renderWithoutCodeList();

      fireEvent.click(screen.getByText("Réutiliser"));
      expect(screen.getByTestId("code-list-dropdown")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));
      expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();
      expect(screen.getByTestId("data-table")).toBeInTheDocument();
    });

    it("should hide DataTable when reuse button is clicked", () => {
      renderWithoutCodeList();

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));
      expect(screen.getByTestId("data-table")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Réutiliser"));
      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });
  });

  describe("onChange callbacks", () => {
    it("should call onChange when label is updated", async () => {
      renderCodeRepresentation();

      editListLabel("Nouveau libellé");

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
      const { rerender } = renderCodeRepresentation();

      const newCodeList: CodeList = {
        ...mockCodeList,
        ID: "codelist-2",
        Label: [{ "@language": "fr-FR", "@value": "Liste modifiée" }],
      };

      rerender(codeRepresentation({ codeList: newCodeList }));

      const labelInput = screen.getByLabelText("Libellé de la liste de codes") as HTMLInputElement;
      expect(labelInput.value).toBe("Liste modifiée");
    });

    it("should preserve label when codeList content changes but ID stays the same", async () => {
      const { rerender } = renderCodeRepresentation();

      // Modifier le label localement
      editListLabel("Label modifié par l'utilisateur");
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

      rerender(codeRepresentation({ codeList: updatedCodeList }));

      // Le label devrait être préservé car l'ID n'a pas changé
      const labelInputAfter = screen.getByLabelText(
        "Libellé de la liste de codes",
      ) as HTMLInputElement;
      expect(labelInputAfter.value).toBe("Label modifié par l'utilisateur");
    });
  });

  describe("label preservation during editing", () => {
    /** Modifie le libellé de la liste et attend que l'édition soit appliquée. */
    const renderWithEditedLabel = async () => {
      renderCodeRepresentation();
      editListLabel("Mon label");
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
    };

    const expectLabelPreserved = () =>
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          Label: [{ "@language": "fr-FR", "@value": "Mon label" }],
        }),
        expect.anything(),
      );

    it("should preserve label when adding a code", async () => {
      // Modifier le label
      await renderWithEditedLabel();

      // Ajouter un code
      const addButton = screen.getByText("Ajouter un code");
      fireEvent.click(addButton);

      // Vérifier que onChange a été appelé avec le label préservé
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(2));
      expectLabelPreserved();
    });

    it("should preserve label when editing a code value", async () => {
      // Modifier le label
      await renderWithEditedLabel();

      mockOnChange.mockClear();

      // Modifier un code (via l'input dans le tableau)
      editFirstValue("10");

      // Vérifier que onChange a été appelé avec le label préservé
      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
      expectLabelPreserved();
    });
  });

  describe("read-only for mutualized lists", () => {
    it("should make code list inputs read-only when the referenced list is mutualized", () => {
      mockAllCodeLists([{ id: "codelist-1", label: "Liste mutualisée", mutualized: true }]);

      renderCodeRepresentation();

      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      expect(labelInput).toHaveAttribute("readOnly");
      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
    });

    it("should keep code list inputs editable when the referenced list is local", () => {
      renderCodeRepresentation();

      const labelInput = screen.getByLabelText("Libellé de la liste de codes");
      expect(labelInput).not.toHaveAttribute("readOnly");
      expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
    });
  });

  describe("selection of a mutualized list", () => {
    it("should display a spinner while the mutualized codes list is loading", () => {
      mockAllCodeLists([{ id: "mut-1", label: "Liste mutualisée", mutualized: true }]);
      mockReusableCodeList("mut-1", { ...idleResult, isLoading: true });

      renderWithoutCodeList();

      reuseCodeList("mut-1");

      expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
      expect(screen.queryByTestId("data-table")).not.toBeInTheDocument();
    });

    it("should fetch and display codes read-only after selecting a mutualized list", () => {
      mockAllCodeLists([{ id: "mut-1", label: "Liste mutualisée", mutualized: true }]);
      mockReusableCodeList("mut-1", successResult(reusedCodeList("mut-1", "Liste mutualisée")));

      renderWithoutCodeList();

      reuseCodeList("mut-1");

      expectReusedCodeDisplayed();
      // read-only mode: no "Ajouter un code" button
      expect(screen.queryByText("Ajouter un code")).not.toBeInTheDocument();
      // dropdown stays visible so the user can change selection
      expect(screen.getByTestId("code-list-dropdown")).toBeInTheDocument();
    });
  });

  describe("reset when create new list is clicked", () => {
    it("should reset to an empty new code list when create new list is clicked after reusing a list", () => {
      mockAllCodeLists([{ id: "grp-1", label: "Liste groupe", mutualized: false }]);
      mockReusableCodeList("grp-1", successResult(reusedCodeList("grp-1", "Liste groupe")));

      renderWithoutCodeList();

      reuseCodeList("grp-1");

      // The reused list is now displayed with its codes
      expect(valueInputs().some((i) => i.value === "01")).toBe(true);

      mockOnChange.mockClear();

      // Clicking "Créer une nouvelle liste" should wipe the reused list and start fresh
      fireEvent.click(screen.getByText("Créer une nouvelle liste"));

      // The reuse dropdown is gone and the reused code is no longer present
      expect(screen.queryByTestId("code-list-dropdown")).not.toBeInTheDocument();
      const values = valueInputs();
      expect(values.some((i) => i.value === "01")).toBe(false);
      expect(values.every((i) => i.value === "")).toBe(true);

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
      renderCodeRepresentation();

      // The existing list shows its code with value "1"
      expect(valueInputs().some((i) => i.value === "1")).toBe(true);

      fireEvent.click(screen.getByText("Créer une nouvelle liste"));

      const values = valueInputs();
      expect(values.some((i) => i.value === "1")).toBe(false);
      expect(values.every((i) => i.value === "")).toBe(true);
    });
  });

  describe("re-selection of an already loaded list", () => {
    it("should display the codes again when re-selecting a previously selected list", () => {
      mockAllCodeLists([
        { id: "mut-1", label: "Liste 1", mutualized: true },
        { id: "mut-2", label: "Liste 2", mutualized: true },
      ]);

      const codesByList: Record<string, { value: string; label: string }> = {
        "mut-1": { value: "01", label: "Agriculture" },
        "mut-2": { value: "02", label: "Industrie" },
      };
      // Références mémoïsées par liste : react-query renvoie un objet stable depuis son cache.
      // Sans cela, un nouvel objet à chaque rendu ferait boucler l'effet de chargement.
      const successCache: Record<string, any> = {};
      const buildSuccess = (id: string) => {
        if (!successCache[id]) {
          successCache[id] = successResult(
            reusedCodeList(id, id, [
              {
                id: `code-${id}`,
                value: codesByList[id].value,
                categoryId: `cat-${id}`,
                category: codesByList[id].label,
              },
            ]),
          );
        }
        return successCache[id];
      };

      // Simule le cache de react-query : tant qu'une liste n'a pas été "chargée", le hook
      // renvoie un état de chargement ; une fois chargée, il renvoie les données en synchrone
      // (comme un cache hit lors d'une re-sélection).
      const loadedKeys = new Set<string>();
      mockUseMutualizedCodeList.mockImplementation((agency: string, id: string) => {
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
        fireEvent.change(screen.getByTestId("code-list-dropdown"), {
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
      mockAllCodeLists([{ id: "grp-1", label: "Liste groupe", mutualized: false }]);
      mockReusableCodeList("grp-1", successResult(reusedCodeList("grp-1", "Liste groupe")));

      renderWithoutCodeList();

      reuseCodeList("grp-1");

      const values = expectReusedCodeDisplayed();
      // editable mode: "Ajouter un code" button is present and inputs are not read-only
      expect(screen.getByText("Ajouter un code")).toBeInTheDocument();
      expect(values.every((i) => !i.hasAttribute("readOnly"))).toBe(true);
    });

    it("keeps the referenced ID and existing codes when editing the label of a reused group list", async () => {
      mockAllCodeLists([{ id: "grp-1", label: "Liste groupe", mutualized: false }]);
      const groupData = reusedCodeList("grp-1", "Liste groupe", [
        { id: "code-1", value: "01", categoryId: "cat-1", category: "Agriculture" },
        { id: "code-2", value: "02", categoryId: "cat-2", category: "Industrie" },
      ]);
      mockReusableCodeList("grp-1", successResult(groupData));

      // Sans ce harnais, l'édition d'une liste réutilisée part d'un codeList toujours `undefined`.
      const changes = renderHarness({
        representation: undefined,
        codeList: undefined,
        categories: [],
      });

      reuseCodeList("grp-1");

      editListLabel("Libellé surchargé");
      // La garde (asynchrone) applique l'édition dans une microtâche.
      await waitFor(() =>
        expect(changes.last[1]?.Label?.[0]?.["@value"]).toBe("Libellé surchargé"),
      );

      const [rep, cl] = changes.last;
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
    /** Liste partagée : édite la valeur du premier code et attend la popup ; renvoie le champ. */
    const editSharedListValue = async () => {
      markListAsShared();
      renderShared();
      const valueInput = editFirstValue("10");
      await waitForDialog(OVERRIDE_SHARED);
      return valueInput;
    };

    it("asks from the very first keystroke, without waiting for the field to be left", async () => {
      // Régression : la popup n'apparaissait qu'à la sortie du champ. Elle est demandée dès la
      // frappe — mais sur une modification DÉJÀ appliquée, si bien que le caractère saisi reste
      // affiché au lieu d'être avalé comme il l'était à l'origine.
      markListAsShared();
      renderShared();

      const valueInput = editFirstValue("10");

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

      editFirstValue("10");

      await waitForDialog(OVERRIDE_SHARED);
    });

    it("creates a variant of the shared list when choosing Créer (case 1)", async () => {
      await editSharedListValue();

      // La popup se ferme et la modification est reportée sur une NOUVELLE liste.
      await resolveDialog(OVERRIDE_SHARED, "variant");
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
      await editSharedListValue();

      await resolveDialog(OVERRIDE_SHARED, "confirm");
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
      await editSharedListValue();

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
      const valueInput = await editSharedListValue();
      await resolveDialog(OVERRIDE_SHARED, "confirm");

      mockOnChange.mockClear();
      editField(valueInput, "11");

      // La 2e édition passe directement, sans rouvrir de popup.
      await waitFor(() => expect(lastChange()[1].Code[0].Value.StringValue).toBe("11"));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("restores the previous value when the user cancels", async () => {
      // La frappe étant appliquée au fil de l'eau, renoncer ne consiste pas à « ne rien faire »
      // mais à remettre le champ dans l'état où il était avant l'édition.
      const valueInput = await editSharedListValue();

      await resolveDialog(OVERRIDE_SHARED, "cancel");
      expect(lastChange()[1].Code[0].Value.StringValue).toBe("1");
      expect(valueInput).toHaveValue("1");
    });

    it("keeps warning that the list is shared once the confirmation was acknowledged", async () => {
      // L'acquittement vaut pour toute la session : sans rappel permanent, plus rien n'indique
      // que les modifications suivantes partent sur une liste utilisée par d'autres.
      markListAsShared();
      renderShared();

      const notice = 'physicalInstance.view.code.sharedNotice.message|{"count":1}';
      expect(screen.getByText(notice)).toBeInTheDocument();

      editFirstValue("10");
      await waitForDialog(OVERRIDE_SHARED);
      await resolveDialog(OVERRIDE_SHARED, "confirm");

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
      markListAsNotShared();
      renderShared();

      editFirstValue("10");

      await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1));
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("does not ask for confirmation when the shared list is mutualized (read-only)", () => {
      markListAsShared();
      mockAllCodeLists([{ id: "codelist-1", label: "Liste mutualisée", mutualized: true }]);

      renderShared();

      // Liste mutualisée → lecture seule : un changement de label ne déclenche pas de confirmation.
      editListLabel("Tentative");

      expect(overrideDialog()).not.toBeInTheDocument();
    });
  });

  describe("confirmation before editing a shared category", () => {
    const currentListUsage = () =>
      otherVariableCategoryUsage({
        variable: { agencyId: "fr.insee", id: "current-variable", label: "Client" },
        codeList: { agencyId: "fr.insee", id: "codelist-1", label: "Liste de codes test" },
      });

    // La catégorie est utilisée par la liste courante ET par une autre liste (via 2 variables) :
    // partagée — 3 lignes mais seulement 2 listes distinctes.
    const markCategoryAsShared = () =>
      mockFetchCategoryUsers.mockResolvedValue([
        currentListUsage(),
        otherVariableCategoryUsage(),
        otherVariableCategoryUsage({
          variable: { agencyId: "fr.insee", id: "third-variable", label: "Troisième variable" },
        }),
      ]);

    // La catégorie n'est utilisée que par la liste courante : non partagée.
    const markCategoryAsOwn = () => mockFetchCategoryUsers.mockResolvedValue([currentListUsage()]);

    const editCategoryLabel = (value: string) =>
      editField(screen.getAllByPlaceholderText("Libellé")[0], value);

    /** Édite le libellé de la catégorie et attend la popup `keyBase`. */
    const editCategoryUntilDialog = async (keyBase: string, value = "Europe modifiée") => {
      editCategoryLabel(value);
      await waitForDialog(keyBase);
    };

    /** Liste ET catégorie partagées (cas 2). */
    const renderSharedListAndCategory = () => {
      markListAsShared();
      markCategoryAsShared();
      renderShared();
    };

    /** Liste propre à la variable, catégorie partagée (cas 3). */
    const renderOwnListWithSharedCategory = () => {
      markListAsNotShared();
      markCategoryAsShared();
      renderShared();
    };

    it("shows the combined list+category dialog when both are shared (case 2)", async () => {
      renderSharedListAndCategory();

      await editCategoryUntilDialog(OVERRIDE_SHARED_CATEGORY);

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
      renderSharedListAndCategory();

      await editCategoryUntilDialog(OVERRIDE_SHARED_CATEGORY);

      await resolveDialog(OVERRIDE_SHARED_CATEGORY, "confirm");
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
      renderOwnListWithSharedCategory();

      await editCategoryUntilDialog(OVERRIDE_CATEGORY);

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
      await resolveDialog(OVERRIDE_CATEGORY, "confirm");
    });

    it("shows the combined dialog for a category edit of a shared list even when the category is only used by this list (case 2)", async () => {
      // Une variante de la liste seule ne suffirait pas : la catégorie resterait partagée entre
      // l'originale et la variante. La popup combinée s'affiche donc dès que la liste est
      // partagée, quel que soit le nombre de listes utilisant la catégorie.
      markListAsShared();
      markCategoryAsOwn();
      renderShared();

      await editCategoryUntilDialog(OVERRIDE_SHARED_CATEGORY, "Oui modifié");
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
      renderOwnListWithSharedCategory();

      await editCategoryUntilDialog(OVERRIDE_CATEGORY);
      await resolveDialog(OVERRIDE_CATEGORY, "cancel");

      const labelInput = screen.getAllByPlaceholderText("Libellé")[0];
      expect(labelInput).toHaveValue("Oui");
      expect(labelInput).not.toHaveAttribute("readonly");

      // Nouvelle tentative : la popup revient, et confirmer applique bien l'édition.
      await editCategoryUntilDialog(OVERRIDE_CATEGORY);
      await resolveDialog(OVERRIDE_CATEGORY, "confirm");

      expect(lastChange()[2][0].Label[0]["@value"]).toBe("Europe modifiée");
    });

    it("creates a variant of the category when choosing Créer (case 3)", async () => {
      renderOwnListWithSharedCategory();

      await editCategoryUntilDialog(OVERRIDE_CATEGORY);

      await resolveDialog(OVERRIDE_CATEGORY, "variant");
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
      renderOwnListWithSharedCategory();

      await editCategoryUntilDialog(OVERRIDE_CATEGORY);
      await resolveDialog(OVERRIDE_CATEGORY, "variant");

      editCategoryLabel("Europe modifiée encore");

      // La variante n'appartient qu'à cette variable : plus rien à confirmer, l'édition passe.
      await waitFor(() =>
        expect(screen.getAllByPlaceholderText("Libellé")[0]).toHaveValue("Europe modifiée encore"),
      );
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("keeps the BasedOn link when the freshly created variant is edited again", async () => {
      // Regression : les frappes suivantes reconstruisaient la categorie a partir de zero et
      // perdaient le lien DDI vers la categorie d'origine.
      markListAsNotShared();
      markCategoryAsShared();

      const changes = renderHarness(
        { representation: mockRepresentation, codeList: mockCodeList, categories: mockCategories },
        { currentVariableId: "current-variable", currentVariableName: "Client" },
      );

      await editCategoryUntilDialog(OVERRIDE_CATEGORY);
      clickDialogAction(OVERRIDE_CATEGORY, "variant");
      await waitFor(() =>
        expect(changes.last[2]?.some((cat) => cat.ID !== "category-1")).toBe(true),
      );

      editCategoryLabel("Europe encore modifiée");

      await waitFor(() => {
        const variant = changes.last[2]?.find((cat) => cat.ID !== "category-1");
        expect(variant?.Label?.[0]?.["@value"]).toBe("Europe encore modifiée");
      });
      const variant = changes.last[2]!.find((cat) => cat.ID !== "category-1")!;
      // Le lien DDI vers la categorie d'origine survit aux frappes suivantes.
      expect(variant.BasedOnObject).toMatchObject({
        BasedOnReference: [expect.objectContaining({ ID: "category-1" })],
      });
    });

    it("creates a variant of both the list and the category when choosing Créer (case 2)", async () => {
      renderSharedListAndCategory();

      await editCategoryUntilDialog(OVERRIDE_SHARED_CATEGORY);

      await resolveDialog(OVERRIDE_SHARED_CATEGORY, "variant");
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

      await editCategoryUntilDialog(OVERRIDE_SHARED, "Oui modifié");
    });

    it("does not ask again after confirming the list dialog raised by a category edit (case 1)", async () => {
      // Regression : la popup liste affichee en repli n'acquittait pas la categorie, si bien que
      // la garde categorie repassait a chaque frappe et rouvrait la popup lettre apres lettre.
      markListAsShared();
      mockFetchCategoryUsers.mockResolvedValue([]);
      renderShared();

      await editCategoryUntilDialog(OVERRIDE_SHARED, "O");
      await resolveDialog(OVERRIDE_SHARED, "confirm");

      mockFetchCategoryUsers.mockClear();
      editCategoryLabel("Ou");

      await waitFor(() => expect(screen.getAllByPlaceholderText("Libellé")[0]).toHaveValue("Ou"));
      expect(mockFetchCategoryUsers).not.toHaveBeenCalled();
      expect(overrideDialog()).not.toBeInTheDocument();
    });

    it("does not ask again after confirming when the category usages cannot be fetched", async () => {
      // Meme boucle quand Colectica ne sait pas repondre sur la categorie (code fraichement
      // ajoute, jamais sauvegarde) : l'accord donne sur la liste vaut pour les frappes suivantes.
      markListAsShared();
      mockFetchCategoryUsers.mockRejectedValue(new Error("Colectica error"));
      renderShared();

      await editCategoryUntilDialog(OVERRIDE_SHARED, "O");
      await resolveDialog(OVERRIDE_SHARED, "confirm");

      editCategoryLabel("Ou");

      await waitFor(() => expect(screen.getAllByPlaceholderText("Libellé")[0]).toHaveValue("Ou"));
      expect(overrideDialog()).not.toBeInTheDocument();
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

      editFirstValue("10");

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

      // Usages de la catégorie inconnus : on ne fabrique pas une popup combinée avec un compte
      // faux, on affiche la popup liste (la liste partagée reste le risque avéré).
      await editCategoryUntilDialog(OVERRIDE_SHARED, "Oui modifié");
    });
  });

  describe("category usage popup", () => {
    it("does not load the category usages before the popup is opened", () => {
      renderCodeRepresentation();

      expect(mockUseCategoryUsers).toHaveBeenCalledWith("", "", false);
    });

    it("opens the usages of the category of the clicked row", async () => {
      mockUseCategoryUsers.mockReturnValue({
        data: [
          categoryUsage({
            variable: { agencyId: "fr.insee", id: "other-variable", label: "Autre variable" },
            codeList: { agencyId: "fr.insee", id: "other-list", label: "Autre liste" },
          }),
        ],
        isLoading: false,
        isError: false,
      });
      renderCodeRepresentation();

      fireEvent.click(screen.getByText("Utilisation"));

      // La popup est ouverte sur la catégorie de la ligne, et son arbre est déplié d'emblée.
      expect(mockUseCategoryUsers).toHaveBeenCalledWith("fr.insee", "category-1", true);
      expect(
        screen.getByText('physicalInstance.view.code.categoryUsage.title|{"label":"Oui"}'),
      ).toBeInTheDocument();
      await waitFor(() => expect(screen.getByText("Autre liste")).toBeInTheDocument());
    });

    it("does not guard the popup behind the shared-edition confirmation", () => {
      renderCodeRepresentation();

      fireEvent.click(screen.getByText("Utilisation"));

      // Consulter les utilisations ne modifie rien : aucune popup de confirmation, aucun onChange.
      expect(
        screen.queryByText("physicalInstance.view.code.overrideShared.title"),
      ).not.toBeInTheDocument();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });
});
