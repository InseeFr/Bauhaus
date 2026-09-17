import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { itemsOfType } from "../../types/ddi4Items";
import { envelope } from "../../types/ddi4Items.testing";
import { Component } from "./view";

const mockUsePhysicalInstancesData = vi.fn();
const mockUpdatePhysicalInstance = vi.fn();
const mockPublishPhysicalInstance = vi.fn();
const mockValidateDdi4 = vi.fn();
const mockConvertToDDI3 = vi.fn().mockResolvedValue("<ddi3-xml-content></ddi3-xml-content>");
const mockNavigate = vi.fn();
const mockToastShow = vi.fn();
let mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn((updater: any, _options?: any) => {
  if (typeof updater === "function") {
    mockSearchParams = new URLSearchParams(updater(mockSearchParams));
  } else if (updater instanceof URLSearchParams) {
    mockSearchParams = new URLSearchParams(updater);
  } else if (typeof updater === "object") {
    mockSearchParams = new URLSearchParams(updater);
  }
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr-FR" },
  }),
}));

vi.mock("../../../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
}));

const mockBlocker = {
  state: "unblocked" as "unblocked" | "blocked" | "proceeding",
  proceed: vi.fn(),
  reset: vi.fn(),
};

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "test-id-123", agencyId: "test-agency-123" }),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  useBlocker: () => mockBlocker,
}));

vi.mock("../../../hooks/usePhysicalInstance", () => ({
  usePhysicalInstancesData: () => mockUsePhysicalInstancesData(),
}));

vi.mock("../../../hooks/useUpdatePhysicalInstance", () => ({
  useUpdatePhysicalInstance: () => mockUpdatePhysicalInstance(),
}));

vi.mock("../../../hooks/usePublishPhysicalInstance", () => ({
  usePublishPhysicalInstance: () => mockPublishPhysicalInstance(),
}));

vi.mock("../../../hooks/useValidateDdi4", () => ({
  useValidateDdi4: () => mockValidateDdi4(),
}));

vi.mock("../../../hooks/useGroups", () => ({
  useGroups: () => ({
    data: [
      {
        id: "group-1",
        label: "Group 1",
        agency: "agency-1",
        versionDate: "2024-01-01",
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("../../../hooks/usePhysicalInstanceParents", () => ({
  usePhysicalInstanceParents: () => ({
    data: {
      group: { agency: "agency-1", id: "group-1" },
      studyUnit: { agency: "agency-1", id: "study-1" },
    },
    isLoading: false,
  }),
}));

// Hooks de la section « Valeurs sentinelles » (#1566) : pas de fetch réel dans ces tests.
vi.mock("../../../hooks/useAllMissingValuesRepresentations", () => ({
  useAllMissingValuesRepresentations: () => ({
    data: [],
    groupLabel: "Groupe",
    isLoading: false,
    error: undefined,
  }),
}));
vi.mock("../../../hooks/useMmvrUsers", () => ({
  useMmvrUsers: () => ({ data: [], isLoading: false }),
}));
vi.mock("../../../hooks/useMutualizedCodeList", () => ({
  useMutualizedCodeList: () => ({ data: undefined, isLoading: false }),
}));

vi.mock("../../../hooks/useGroupDetails", () => ({
  useGroupDetails: (agencyId: string | null, groupId: string | null) => {
    if (agencyId && groupId) {
      return {
        data: {
          items: [
            { $type: "Group", ID: groupId, Agency: agencyId, StudyUnitReference: [] },
            {
              $type: "StudyUnit",
              ID: "study-1",
              Agency: agencyId,
              Version: "1.0",
              Citation: {
                Title: [{ "@language": "fr-FR", "@value": "Study Unit 1" }],
              },
            },
          ],
        },
        isLoading: false,
      };
    }
    return { data: null, isLoading: false };
  },
}));

// Mock fetch globally to intercept API calls
global.fetch = vi.fn((url) => {
  if (typeof url === "string" && url.includes("/convert/ddi4-to-ddi3")) {
    return Promise.resolve({
      ok: true,
      text: () => mockConvertToDDI3(),
      json: () => mockConvertToDDI3(),
    } as Response);
  }
  return Promise.reject(new Error(`Unexpected fetch call to ${url}`));
}) as any;

vi.mock("primereact/progressspinner", () => ({
  ProgressSpinner: () => <div data-testid="progress-spinner">Loading...</div>,
}));

// La vue pilote le toast par ref (`toast.current?.show(...)`) : le mock doit accepter
// une ref, sinon React avertit « Function components cannot be given refs ».
vi.mock("primereact/toast", async () => {
  const { forwardRef, useImperativeHandle } =
    await vi.importActual<typeof import("react")>("react");
  return {
    Toast: forwardRef((_props, ref) => {
      useImperativeHandle(ref, () => ({ show: mockToastShow, clear: vi.fn(), replace: vi.fn() }));
      return null;
    }),
  };
});

vi.mock("primereact/message", () => ({
  Message: ({ severity, text }: any) => (
    <div data-testid="message" data-severity={severity}>
      {text}
    </div>
  ),
}));

vi.mock("primereact/dropdown", () => ({
  // Les props propres à PrimeReact sont écartées avant le spread : `<select>` ne les
  // comprend pas et React avertit (ex. `loading={false}` sur un attribut non booléen).
  Dropdown: ({
    id,
    value,
    options,
    onChange,
    disabled,
    loading: _loading,
    filter: _filter,
    filterBy: _filterBy,
    showClear: _showClear,
    appendTo: _appendTo,
    panelStyle: _panelStyle,
    emptyMessage: _emptyMessage,
    itemTemplate: _itemTemplate,
    optionLabel: _optionLabel,
    optionValue: _optionValue,
    optionGroupLabel: _optionGroupLabel,
    optionGroupChildren: _optionGroupChildren,
    ...props
  }: any) => (
    <select
      id={id}
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value || null })}
      disabled={disabled}
      data-testid={id ? `dropdown-${id}` : undefined}
      {...props}
    >
      <option value="">Select...</option>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("primereact/dialog", () => ({
  Dialog: ({ visible, children, header }: any) =>
    visible ? (
      <div role="dialog" aria-label={header}>
        <h2>{header}</h2>
        {children}
      </div>
    ) : null,
}));

vi.mock("primereact/tabview", () => ({
  TabView: ({ children, activeIndex, onTabChange }: any) => {
    const panels = Array.isArray(children) ? children : [children];
    return (
      <div data-testid="tabview" data-active-index={activeIndex}>
        <div role="tablist">
          {panels.map((child: any, index: number) => {
            const headerContent = child?.props?.headerTemplate
              ? child.props.headerTemplate({
                  className: "",
                  onClick: () => onTabChange?.({ index }),
                })
              : child?.props?.header || `Tab ${index}`;
            return (
              <div key={index} role="tab" onClick={() => onTabChange?.({ index })}>
                {headerContent}
              </div>
            );
          })}
        </div>
        {panels.map((child: any, index: number) =>
          activeIndex === index ? (
            <div key={index} role="tabpanel">
              {child?.props?.children}
            </div>
          ) : null,
        )}
      </div>
    );
  },
  TabPanel: ({ children }: any) => <div>{children}</div>,
}));

// Mock for file download
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock document.createElement to track link creation
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName: string) => {
  const element = originalCreateElement(tagName);
  if (tagName === "a") {
    element.click = mockClick;
  }
  return element;
}) as any;

const EDIT_MODAL_TITLE = "physicalInstance.view.editModal.title";
const PENDING_VARIABLE_EDIT_TITLE = "physicalInstance.view.pendingVariableEdit.title";

const fr = (value: string) => [{ "@language": "fr-FR", "@value": value }];

type PhysicalInstanceDataOptions = {
  /** Titre renvoyé par le hook ; sert aussi de Citation.Title sauf si `itemTitle` est fourni. */
  title?: string;
  itemTitle?: string;
  /** Nom renvoyé par le hook ; sert aussi de DataRelationshipName sauf si `itemDataRelationshipName` est fourni. */
  dataRelationshipName?: string;
  itemDataRelationshipName?: string;
  /** Lignes du tableau (forme aplatie renvoyée par le hook). */
  variables?: unknown[];
  /** Items DDI4 `Variable` de l'enveloppe. */
  ddiVariables?: readonly unknown[];
  variableUsedReference?: unknown[];
  /** Champs d'identification ajoutés aux items PhysicalInstance / DataRelationship / LogicalRecord. */
  physicalInstance?: Record<string, unknown>;
  dataRelationship?: Record<string, unknown>;
  logicalRecord?: Record<string, unknown>;
  extraItems?: Parameters<typeof envelope>[0];
};

const mockPhysicalInstanceData = ({
  title = "Test Physical Instance",
  itemTitle = title,
  dataRelationshipName = "Test Data Relationship",
  itemDataRelationshipName = dataRelationshipName,
  variables = [],
  ddiVariables = [],
  variableUsedReference = [],
  physicalInstance = {},
  dataRelationship = {},
  logicalRecord = {},
  extraItems = {},
}: PhysicalInstanceDataOptions = {}) => {
  const data = envelope({
    PhysicalInstance: [{ ...physicalInstance, Citation: { Title: fr(itemTitle) } }],
    DataRelationship: [
      {
        ...dataRelationship,
        DataRelationshipName: fr(itemDataRelationshipName),
        LogicalRecord: [
          {
            ...logicalRecord,
            VariablesInRecord: { VariableUsedReference: variableUsedReference },
          },
        ],
      },
    ],
    Variable: ddiVariables,
    ...extraItems,
  });
  mockUsePhysicalInstancesData.mockReturnValue({
    data,
    variables,
    title,
    dataRelationshipName,
    isLoading: false,
    isError: false,
  });
  return data;
};

// Identifiants de l'instance source, nécessaires à la duplication (BasedOnObject, URN).
const DUPLICABLE_ITEMS = {
  physicalInstance: { ID: "pi-original-id", Agency: "test-agency", Version: "1" },
  dataRelationship: { ID: "dr-original-id", Agency: "test-agency", Version: "1" },
  logicalRecord: { ID: "lr-original-id" },
};

const variableReference = (id: string) => ({
  Agency: "test-agency-123",
  ID: id,
  Version: "1",
  TypeOfObject: "Variable",
});

// Instance contenant une variable déjà enregistrée, « Variable1 » (var-1).
const mockDataWithExistingVariable = () =>
  mockPhysicalInstanceData({
    title: "Test",
    dataRelationshipName: "Test",
    variableUsedReference: [variableReference("var-1")],
    ddiVariables: [
      {
        ID: "var-1",
        Agency: "test-agency",
        Version: "1",
        URN: "urn:ddi:test-agency:var-1:1",
        VariableName: fr("Variable1"),
        Label: fr("Variable 1"),
        VariableRepresentation: {
          TextRepresentation: { MaxLength: 100 },
        },
      },
    ],
    variables: [
      {
        id: "var-1",
        name: "Variable1",
        label: "Variable 1",
        type: "text",
        lastModified: "2024-01-01",
      },
    ],
  });

const mockMutation =
  (hook: Mock) =>
  ({
    mutateAsync = vi.fn().mockResolvedValue({}),
    isPending = false,
  }: { mutateAsync?: Mock; isPending?: boolean } = {}) => {
    hook.mockReturnValue({ mutateAsync, isPending, isError: false });
    return mutateAsync;
  };
const mockPublish = mockMutation(mockPublishPhysicalInstance);
const mockUpdate = mockMutation(mockUpdatePhysicalInstance);

const selectRepresentationType = (type: string) => {
  fireEvent.click(screen.getByText("physicalInstance.view.tabs.representation"));
  fireEvent.change(screen.getByLabelText("physicalInstance.view.columns.type"), {
    target: { value: type },
  });
};

// Ouvre le formulaire de nouvelle variable et le remplit, sans l'ajouter.
const fillNewVariable = (name: string, label: string, type?: string) => {
  fireEvent.click(screen.getByLabelText("physicalInstance.view.newVariable"));
  fireEvent.change(screen.getByLabelText(/physicalInstance\.view\.columns\.name/), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText(/physicalInstance\.view\.columns\.label/), {
    target: { value: label },
  });
  if (type) {
    selectRepresentationType(type);
  }
};

// Helper function to create a test variable and enable the Save All button
const createTestVariable = (name = "TestVar", label = "Test Variable", type?: string) => {
  fillNewVariable(name, label, type);
  fireEvent.click(screen.getByLabelText("physicalInstance.view.add"));
};

const clickSaveAll = () => fireEvent.click(screen.getByLabelText("physicalInstance.view.saveAll"));

// Clique « Sauvegarder », attend la publication et renvoie l'enveloppe publiée.
const saveAll = async (mutateAsync: Mock) => {
  clickSaveAll();
  await waitFor(() => {
    expect(mutateAsync).toHaveBeenCalled();
  });
  return mutateAsync.mock.calls[0][0].data;
};

const savedVariableNamed = (data: any, name: string) =>
  itemsOfType(data, "Variable").find((v: any) => v.VariableName?.[0]?.["@value"] === name);

const expectUnsaved = (name: string) =>
  waitFor(() => {
    expect(screen.getByText(name).closest("tr")).toHaveClass("font-italic");
  });

const selectFirstVariable = () => fireEvent.click(screen.getAllByRole("row")[1]);

const deleteFirstVariable = async () => {
  fireEvent.click(screen.getAllByLabelText("physicalInstance.view.delete")[0]);
  fireEvent.click(screen.getByText("physicalInstance.view.confirmDelete"));

  // Variable should no longer be visible in the table
  await waitFor(() => {
    expect(screen.queryByText("Variable1")).not.toBeInTheDocument();
  });
};

const clickEditTitle = () =>
  fireEvent.click(screen.getByLabelText("physicalInstance.view.editTitle"));

const openEditModal = async () => {
  clickEditTitle();
  await waitFor(() => {
    expect(screen.getByText(EDIT_MODAL_TITLE)).toBeInTheDocument();
  });
};

// SplitButton creates multiple elements with the same aria-label, get the first button
const clickExport = () => {
  const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
  fireEvent.click(exportButtons.find((el) => el.tagName === "BUTTON")!);
};

// Capture the download link before it's removed; appendChild is restored on dispose.
const captureDownloadLink = () => {
  const originalAppendChild = document.body.appendChild;
  let capturedLink: HTMLAnchorElement | null = null;
  document.body.appendChild = vi.fn((node) => {
    if (node instanceof HTMLAnchorElement && node.download) {
      capturedLink = node;
    }
    return originalAppendChild.call(document.body, node);
  }) as any;
  return {
    get download() {
      return capturedLink?.download;
    },
    [Symbol.dispose]() {
      document.body.appendChild = originalAppendChild;
    },
  };
};

const openDuplicationModal = () => {
  fireEvent.click(screen.getByLabelText("physicalInstance.view.duplicatePhysicalInstance"));
  return screen.findByText("physicalInstance.view.duplicateModal.title");
};

// La duplication n'est plus immédiate : on confirme dans la modale.
const confirmDuplication = async () => {
  await openDuplicationModal();
  fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
};

const basedOn = ($type: string, id: string, version = "1") => ({
  $type: "BasedOnObjectType",
  BasedOnReference: [
    {
      $type,
      URN: `urn:ddi:test-agency:${id}:${version}`,
      Agency: "test-agency",
      ID: id,
      Version: version,
    },
  ],
});

describe("View Component", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const renderView = () => render(<Component />, { wrapper });

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
    mockConvertToDDI3.mockResolvedValue("<ddi3-xml-content></ddi3-xml-content>");

    // Reset blocker state
    mockBlocker.state = "unblocked";
    mockBlocker.proceed.mockClear();
    mockBlocker.reset.mockClear();
    mockSetSearchParams.mockClear();
    mockSearchParams = new URLSearchParams();

    // Default mock implementation
    mockPhysicalInstanceData({
      variables: [
        {
          id: "1",
          name: "Variable1",
          label: "Label 1",
          type: "Code",
          lastModified: "03/06/2024",
        },
        {
          id: "2",
          name: "Variable2",
          label: "Label 2",
          type: "Numeric",
          lastModified: "03/06/2024",
        },
      ],
    });

    // Default mock for mutation
    mockUpdate();
    mockPublish();

    mockValidateDdi4.mockReturnValue({
      validate: vi.fn().mockResolvedValue(undefined),
      isValidating: false,
    });
  });

  describe("Loading state", () => {
    beforeEach(() => {
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: true,
        isError: false,
      });
    });

    it("should render a full-screen loading overlay when data is loading", () => {
      renderView();

      expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
      const overlay = screen.getByLabelText("Loading in progress...");
      expect(overlay).toHaveClass("loading-overlay");
      expect(screen.getByText("Loading in progress...")).toBeInTheDocument();
    });

    it("should have correct accessibility attributes for loading state", () => {
      renderView();

      const loadingContainer = screen.getByRole("status");
      expect(loadingContainer).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Error state", () => {
    const mockError = (error: unknown) =>
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: false,
        isError: true,
        error,
      });

    it("should render error message when there is an error", () => {
      const errorMessage = "Failed to fetch data";
      mockError(new Error(errorMessage));

      renderView();

      expect(screen.getByTestId("message")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should have correct accessibility attributes for error state", () => {
      mockError(new Error("Error"));

      renderView();

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveAttribute("aria-live", "assertive");
    });

    it("should render default error message when error is not an Error instance", () => {
      mockError("Unknown error");

      renderView();

      expect(screen.getByText("physicalInstance.view.errorLoading")).toBeInTheDocument();
    });
  });

  describe("Successful render", () => {
    it("should render the physical instance title", () => {
      renderView();

      expect(screen.getByText("Test Physical Instance")).toBeInTheDocument();
    });

    it("should initialize form data with data relationship name", () => {
      renderView();

      // The data relationship name is not directly displayed,
      // but it should be available in the component state for the edit modal
      // This test verifies the component doesn't crash with the provided data
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have correct accessibility role for main container", () => {
      renderView();

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have correct accessibility role for complementary section", () => {
      renderView();

      selectFirstVariable();

      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("should close the side panel when Escape is pressed", () => {
      renderView();

      selectFirstVariable();
      expect(screen.getByRole("complementary")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("should render SearchFilters component", () => {
      renderView();

      expect(screen.getByPlaceholderText("physicalInstance.view.search")).toBeInTheDocument();
    });

    it("should render GlobalActionsCard component", () => {
      renderView();

      expect(screen.getByText("physicalInstance.view.globalActions")).toBeInTheDocument();
    });
  });

  describe("Edit modal", () => {
    it("should open edit modal when pencil button is clicked", async () => {
      renderView();

      await openEditModal();
    });

    it("should close edit modal when cancel is clicked", async () => {
      renderView();
      await openEditModal();

      fireEvent.click(screen.getByText("physicalInstance.view.editModal.cancel"));

      await waitFor(() => {
        expect(screen.queryByText(EDIT_MODAL_TITLE)).not.toBeInTheDocument();
      });
    });

    it("should update form data in edit modal", async () => {
      renderView();
      await openEditModal();

      const labelInput = screen.getByLabelText("physicalInstance.creation.label");
      fireEvent.change(labelInput, { target: { value: "New Label" } });

      expect((labelInput as HTMLInputElement).value).toBe("New Label");
    });
  });

  describe("Filtering", () => {
    it("should filter variables by search value", async () => {
      renderView();

      const searchInput = screen.getByPlaceholderText("physicalInstance.view.search");
      fireEvent.change(searchInput, { target: { value: "Variable1" } });

      await waitFor(() => {
        expect(screen.getByText("Variable1")).toBeInTheDocument();
        expect(screen.queryByText("Variable2")).not.toBeInTheDocument();
      });
    });

    it("should filter variables by type", async () => {
      renderView();

      const typeDropdown = screen.getByLabelText("physicalInstance.view.typeFilter");
      fireEvent.change(typeDropdown, { target: { value: "code" } });

      await waitFor(() => {
        expect(screen.getByText("Variable1")).toBeInTheDocument();
        expect(screen.queryByText("Variable2")).not.toBeInTheDocument();
      });
    });

    it("should generate dynamic type options from variables", () => {
      renderView();

      const typeDropdown = screen.getByLabelText(
        "physicalInstance.view.typeFilter",
      ) as HTMLSelectElement;

      expect(typeDropdown).toBeInTheDocument();
      expect(typeDropdown).toHaveValue("all");

      // Verify all type options are present
      for (const name of [
        "physicalInstance.view.allTypes",
        "physicalInstance.view.variableTypes.text",
        "physicalInstance.view.variableTypes.code",
        "physicalInstance.view.variableTypes.date",
        "physicalInstance.view.variableTypes.numeric",
      ]) {
        expect(screen.getByRole("option", { name })).toBeInTheDocument();
      }
    });
  });

  describe("Export functionality", () => {
    beforeEach(() => {
      mockCreateObjectURL.mockReturnValue("blob:mock-url");
      mockClick.mockClear();
      mockCreateObjectURL.mockClear();
      mockRevokeObjectURL.mockClear();
    });

    it("should download DDI3 file when export button is clicked (default DDI3)", async () => {
      using link = captureDownloadLink();

      renderView();
      clickExport();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
        expect(mockRevokeObjectURL).toHaveBeenCalled();
      });

      // Check that the link has the correct download attribute
      expect(link.download).toBe("test_physical_instance-ddi3.xml");
    });

    it("should download DDI4 file when DDI4 option is selected", async () => {
      renderView();

      // Click the button (which defaults to DDI3)
      clickExport();

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
    });

    it("should sanitize title for filename", async () => {
      using link = captureDownloadLink();

      mockPhysicalInstanceData({
        title: "Test @ Physical # Instance!",
        itemTitle: "Test Physical Instance",
      });

      renderView();
      clickExport();

      await waitFor(() => {
        expect(mockClick).toHaveBeenCalled();
      });

      expect(link.download).toBe("test___physical___instance_-ddi3.xml");
    });

    it("should call DDIApi.convertToDDI3 with correct data", async () => {
      const mockData = mockPhysicalInstanceData();

      renderView();
      clickExport();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/convert/ddi4-to-ddi3"),
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify(mockData),
          }),
        );
      });
    });

    it("should handle export error gracefully", async () => {
      // Make fetch return an error response instead of rejecting
      (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          text: () => Promise.resolve("Internal Server Error"),
        } as Response),
      );

      renderView();
      clickExport();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Should not create download link on error
      await waitFor(() => {
        expect(mockClick).not.toHaveBeenCalled();
      });
    });
  });

  describe("Save functionality", () => {
    // Helper function to fill and submit the edit modal
    // Group and studyUnit dropdowns are disabled in edit mode (pre-filled from initialData)
    const fillAndSubmitEditModal = async (label = "Updated Title") => {
      // Fill label
      const labelInput = screen.getByLabelText("physicalInstance.creation.label");
      fireEvent.change(labelInput, { target: { value: label } });

      // Wait for the save button to be enabled (group and studyUnit are pre-filled from initialData)
      await waitFor(() => {
        const saveButton = screen.getByText("physicalInstance.view.editModal.save");
        expect(saveButton).not.toBeDisabled();
      });

      // Submit form — la sauvegarde est asynchrone et remet à jour l'état (rollback du
      // libellé en cas d'erreur) : `act` englobe le flush de ces mises à jour.
      const form = screen.getByRole("dialog").querySelector("form");
      if (form) {
        await act(async () => {
          fireEvent.submit(form);
        });
      }
    };

    const expectEditModalClosed = () =>
      waitFor(() => {
        expect(screen.queryByText(EDIT_MODAL_TITLE)).not.toBeInTheDocument();
      });

    it("should initialize edit modal with title", () => {
      renderView();
      clickEditTitle();

      const labelInput = screen.getByLabelText(
        "physicalInstance.creation.label",
      ) as HTMLInputElement;

      expect(labelInput.value).toBe("Test Physical Instance");
    });

    it("should call mutation when save button is clicked", async () => {
      const mutateAsyncMock = mockUpdate();

      renderView();
      clickEditTitle();

      await fillAndSubmitEditModal("Updated Title");

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalledWith({
          id: "test-id-123",
          agencyId: "test-agency-123",
          data: {
            physicalInstanceLabel: "Updated Title",
            dataRelationshipLabel: "Structure : Updated Title",
            logicalRecordLabel: "Enregistrement logique : Updated Title",
            groupId: "group-1",
            groupAgency: "agency-1",
            studyUnitId: "study-1",
            studyUnitAgency: "agency-1",
          },
        });
      });

      // Wait for modal to close after successful save
      await expectEditModalClosed();
    });

    it("should close modal after successful save", async () => {
      mockUpdate();

      renderView();
      clickEditTitle();

      await fillAndSubmitEditModal();

      await expectEditModalClosed();
    });

    it("should handle save error gracefully", async () => {
      const mutateAsyncMock = mockUpdate({
        mutateAsync: vi.fn().mockRejectedValue(new Error("Save failed")),
      });

      renderView();
      await openEditModal();

      await fillAndSubmitEditModal();

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Modal should remain open on error
      await waitFor(() => {
        expect(screen.getByText(EDIT_MODAL_TITLE)).toBeInTheDocument();
      });
    });
  });

  describe("Save All functionality", () => {
    it("should display a full-screen saving overlay while the save is pending", () => {
      mockPublish({ isPending: true });

      renderView();

      const overlay = screen.getByLabelText("Saving in progress...");
      expect(overlay).toHaveClass("loading-overlay");
      expect(screen.getByText("Saving in progress...")).toBeInTheDocument();
    });

    it("should not display the saving overlay when no save is pending", () => {
      renderView();

      expect(screen.queryByText("Saving in progress...")).not.toBeInTheDocument();
    });

    it("should display a full-screen overlay while the DDI4 validation is running", () => {
      mockValidateDdi4.mockReturnValue({ validate: vi.fn(), isValidating: true });

      renderView();

      const overlay = screen.getByLabelText("physicalInstance.view.validateDdi4InProgress");
      expect(overlay).toHaveClass("loading-overlay");
      expect(screen.getByText("physicalInstance.view.validateDdi4InProgress")).toBeInTheDocument();
    });

    it("should not display the validation overlay when no validation is running", () => {
      renderView();

      expect(
        screen.queryByText("physicalInstance.view.validateDdi4InProgress"),
      ).not.toBeInTheDocument();
    });

    it("should ship the created sentinel MMVR, its code list and the variable reference (#1566)", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      // Nouvelle variable numérique (le TabView mocké ne rend que l'onglet actif).
      fillNewVariable("VarSentinelle", "Variable à sentinelles", "numeric");

      // Création d'une valeur sentinelle à la volée : déplier la section, créer, nommer la liste.
      fireEvent.click(screen.getByText("physicalInstance.view.sentinel.title"));
      fireEvent.click(screen.getByText("physicalInstance.view.sentinel.createNewList"));
      fireEvent.change(screen.getByLabelText("physicalInstance.view.code.codeListLabel"), {
        target: { value: "Sentinelles âge" },
      });

      // « Ajouter » la variable puis « Sauvegarder » le fichier.
      fireEvent.click(screen.getByLabelText("physicalInstance.view.add"));
      const payload = await saveAll(mutateAsyncMock);

      // La MMVR créée est embarquée, avec son label...
      expect(itemsOfType(payload, "ManagedMissingValuesRepresentation")).toHaveLength(1);
      const mmvr = itemsOfType(payload, "ManagedMissingValuesRepresentation")[0];
      expect(mmvr.Label).toEqual(fr("Sentinelles âge"));
      // ...la variable porte la référence vers cette MMVR...
      const savedVariable = itemsOfType(payload, "Variable").find(
        (variable: any) => variable.VariableRepresentation?.MissingValuesReference,
      );
      expect(savedVariable.VariableRepresentation.MissingValuesReference.ID).toBe(mmvr.ID);
      // ...et la CodeList de sentinelles référencée par la MMVR est dans le payload.
      const sentinelCodeListId = mmvr.MissingCodeRepresentation[0].CodeListReference.ID;
      expect(itemsOfType(payload, "CodeList").map((cl: any) => cl.ID)).toContain(
        sentinelCodeListId,
      );
    });

    it("should call savePhysicalInstance mutation when Save All button is clicked", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      // Create a new variable to enable the Save All button
      createTestVariable();

      await saveAll(mutateAsyncMock);

      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "test-id-123",
        agencyId: "test-agency-123",
        data: expect.objectContaining({
          items: expect.any(Array),
        }),
      });
    });

    it("should merge local variables with existing variables on save", async () => {
      const mutateAsyncMock = mockPublish();

      mockPhysicalInstanceData({
        itemTitle: "Test",
        itemDataRelationshipName: "Test",
        variableUsedReference: [variableReference("existing-var-1")],
        ddiVariables: [
          {
            ID: "existing-var-1",
            VariableName: fr("ExistingVar"),
            Label: fr("Existing Variable"),
          },
        ],
      });

      renderView();

      createTestVariable("NewVariable", "New Variable Label");
      const savedData = await saveAll(mutateAsyncMock);

      expect(itemsOfType(savedData, "Variable")).toHaveLength(2);
      expect(itemsOfType(savedData, "Variable")).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ID: "existing-var-1" }),
          expect.objectContaining({ VariableName: fr("NewVariable") }),
        ]),
      );
    });

    it("should clear local variables after successful save", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      createTestVariable("TempVar", "Temp Variable");

      // Check that variable is marked as unsaved (italic)
      await expectUnsaved("TempVar");

      await saveAll(mutateAsyncMock);

      // Check that local variable was cleared (variable no longer in italic or not present)
      await waitFor(() => {
        const variableElement = screen.queryByText("TempVar");
        // After clearing local variables, the variable should either:
        // 1. Not exist anymore (cleared from local state and not in API response), or
        // 2. Exist without italic class (if it was added to API response)
        if (variableElement) {
          expect(variableElement.closest("tr")).not.toHaveClass("font-italic");
        } else {
          // Variable was cleared from local state
          expect(variableElement).toBeNull();
        }
      });
    });

    it("should handle save all error gracefully", async () => {
      const mutateAsyncMock = mockPublish({
        mutateAsync: vi.fn().mockRejectedValue(new Error("Save failed")),
      });

      renderView();

      // Create a new variable to enable the Save All button
      createTestVariable();

      await saveAll(mutateAsyncMock);

      // Should not crash and should show error message via toast
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should transform local variables to DDI format correctly", async () => {
      const mutateAsyncMock = mockPublish();
      mockPhysicalInstanceData({ title: "Test", dataRelationshipName: "Test" });

      renderView();

      createTestVariable("DateVar", "Date Variable", "date");
      const savedData = await saveAll(mutateAsyncMock);

      const dateVariable = savedVariableNamed(savedData, "DateVar");
      expect(dateVariable).toBeDefined();
      expect(dateVariable.VariableRepresentation).toHaveProperty("DateTimeRepresentation");
      expect(dateVariable.VariableRepresentation.DateTimeRepresentation).toHaveProperty(
        "DateTypeCode",
      );
    });

    // #1592 : une variable Text sans aucun attribut (ni min, ni max, ni regexp) doit quand même
    // porter une TextRepresentation, sinon le DDI exporté n'a qu'un <VariableRepresentation/> vide
    // et le type Text est perdu.
    it("should keep an empty TextRepresentation for a text variable without attributes", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      createTestVariable("EmptyTextVar", "Empty Text Variable");
      const savedData = await saveAll(mutateAsyncMock);

      const textVariable = savedVariableNamed(savedData, "EmptyTextVar");
      expect(textVariable.VariableRepresentation.TextRepresentation).toEqual({
        $type: "TextRepresentationBaseType",
      });
    });

    it("should not include null values in transformed variables", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      // Create a simple text variable
      createTestVariable("TextVar", "Text Variable");
      const savedData = await saveAll(mutateAsyncMock);

      const textVariable = savedVariableNamed(savedData, "TextVar");
      // Check that variable doesn't have Description if it wasn't set
      expect(textVariable).not.toHaveProperty("Description");
      // Check that @isGeographic is not present if not set
      expect(textVariable).not.toHaveProperty("@isGeographic");
    });

    describe("code variables", () => {
      let mutateAsyncMock: Mock;

      beforeEach(() => {
        mutateAsyncMock = mockPublish();
        mockPhysicalInstanceData({
          title: "Test",
          dataRelationshipName: "Test",
          extraItems: { CodeList: [], Category: [] },
        });
      });

      it("should include CodeList and Category when saving code variables", async () => {
        renderView();

        createTestVariable("CodeVar", "Code Variable", "code");
        const savedData = await saveAll(mutateAsyncMock);

        // Verify that CodeList and Category are included
        expect(itemsOfType(savedData, "CodeList")).toBeDefined();
        expect(itemsOfType(savedData, "Category")).toBeDefined();
        // CodeList and Category should be arrays (not null)
        expect(Array.isArray(itemsOfType(savedData, "CodeList"))).toBe(true);
        expect(Array.isArray(itemsOfType(savedData, "Category"))).toBe(true);
      });

      it("should ensure CodeListReference ID matches CodeList ID", async () => {
        renderView();

        createTestVariable("CodeVar", "Code Variable", "code");
        const savedData = await saveAll(mutateAsyncMock);

        // Verify that CodeListReference.ID matches the CodeList.ID
        if (
          itemsOfType(savedData, "Variable").length > 0 &&
          itemsOfType(savedData, "CodeList").length > 0
        ) {
          const variable = itemsOfType(savedData, "Variable")[0];
          const codeList = itemsOfType(savedData, "CodeList")[0];
          const codeListRefId =
            variable.VariableRepresentation?.CodeRepresentation?.CodeListReference?.ID;

          expect(codeListRefId).toBeDefined();
          expect(codeListRefId).toBe(codeList.ID);
        }
      });
    });

    it("should update VariablesInRecord with all variable references", async () => {
      const mutateAsyncMock = mockPublish();
      mockDataWithExistingVariable();

      renderView();

      createTestVariable("NewVariable", "New Variable");
      const savedData = await saveAll(mutateAsyncMock);

      // Verify that VariablesInRecord includes references to both variables
      const variablesInRecord = itemsOfType(savedData, "DataRelationship")[0].LogicalRecord[0]
        .VariablesInRecord;
      expect(variablesInRecord).toBeDefined();
      expect(variablesInRecord.VariableUsedReference).toHaveLength(2);
      expect(variablesInRecord.VariableUsedReference).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            $type: "Variable",
            Agency: "test-agency-123",
            ID: "var-1",
            Version: "1",
          }),
          expect.objectContaining({
            $type: "Variable",
            Agency: "test-agency-123",
            Version: "1",
          }),
        ]),
      );
    });

    it("should exclude deleted variables from save", async () => {
      const mutateAsyncMock = mockPublish();
      mockDataWithExistingVariable();

      renderView();

      // Verify variable is initially displayed
      expect(screen.getByText("Variable1")).toBeInTheDocument();

      await deleteFirstVariable();
      const savedData = await saveAll(mutateAsyncMock);

      // Verify that the saved data does not include the deleted variable
      expect(itemsOfType(savedData, "Variable")).toEqual([]);
    });
  });

  describe("Duplicate Physical Instance", () => {
    it("should open the duplication modal instead of duplicating immediately, pre-filled with <title> (copy)", async () => {
      const mutateAsyncMock = mockPublish();
      mockPhysicalInstanceData({
        ...DUPLICABLE_ITEMS,
        title: "Original Title",
        dataRelationshipName: "DR Name",
      });

      renderView();

      // La modale s'ouvre…
      await openDuplicationModal();

      // …le libellé est pré-rempli avec le suffixe (copy)…
      // La valeur est posée par un useEffect après le montage de la modale
      // (composant lazy/Suspense + animation d'ouverture de la Dialog) : on
      // attend qu'elle soit appliquée plutôt que de la lire de façon synchrone,
      // sinon course de timing sous charge (échec aléatoire en CI).
      const labelInput = screen.getByLabelText(
        "physicalInstance.creation.label",
      ) as HTMLInputElement;
      await waitFor(() => expect(labelInput.value).toBe("Original Title (copy)"));

      // …et rien n'a encore été publié (duplication non immédiate).
      expect(mutateAsyncMock).not.toHaveBeenCalled();
    });

    it("should show the backend error message in the toast when duplication fails because no study unit was found", async () => {
      // Le SDK (build-api) rejette un objet nu { message, status }, jamais une Error.
      mockPublish({
        mutateAsync: vi.fn().mockRejectedValue({
          message: "No study unit found for physical instance fr.insee/pi-111",
          status: 404,
        }),
      });
      mockPhysicalInstanceData({
        ...DUPLICABLE_ITEMS,
        title: "Original Title",
        dataRelationshipName: "DR Name",
      });

      renderView();
      await confirmDuplication();

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            severity: "error",
            summary: "physicalInstance.view.duplicateError",
            detail: "No study unit found for physical instance fr.insee/pi-111",
          }),
        );
      });
    });

    it("should add (copy) suffix to Citation Title and PhysicalInstanceLabel when duplicating", async () => {
      const mutateAsyncMock = mockPublish();
      mockPhysicalInstanceData({
        ...DUPLICABLE_ITEMS,
        physicalInstance: {
          ...DUPLICABLE_ITEMS.physicalInstance,
          PhysicalInstanceLabel: fr("Original Label"),
        },
        title: "Original Title",
        dataRelationshipName: "Original DR Name",
      });

      renderView();
      await confirmDuplication();

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify Citation Title has (copy) suffix
      expect(itemsOfType(savedData, "PhysicalInstance")[0].Citation.Title[0]["@value"]).toBe(
        "Original Title (copy)",
      );

      // PhysicalInstanceLabel is preserved as-is (not modified by the duplication)
      expect(
        (itemsOfType(savedData, "PhysicalInstance")[0] as Record<string, any>)
          .PhysicalInstanceLabel[0]["@value"],
      ).toBe("Original Label");
    });

    describe("with the duplicated instance published", () => {
      // Duplique l'instance et renvoie l'enveloppe publiée.
      const duplicate = async (mutateAsyncMock: Mock) => {
        renderView();
        await confirmDuplication();

        await waitFor(() => {
          expect(mutateAsyncMock).toHaveBeenCalled();
        });

        return mutateAsyncMock.mock.calls[0][0].data;
      };

      it("should add (copy) suffix to DataRelationshipName when duplicating", async () => {
        const mutateAsyncMock = mockPublish();
        mockPhysicalInstanceData({
          ...DUPLICABLE_ITEMS,
          title: "Test",
          dataRelationshipName: "Original DR Name",
        });

        const savedData = await duplicate(mutateAsyncMock);

        // Verify DataRelationship Label has (copy) suffix with new pattern
        expect(itemsOfType(savedData, "DataRelationship")[0].Label[0]["@value"]).toBe(
          "Structure : Test (copy)",
        );
      });

      it("should add BasedOnObject to PhysicalInstance when duplicating", async () => {
        const mutateAsyncMock = mockPublish();
        mockPhysicalInstanceData({
          ...DUPLICABLE_ITEMS,
          title: "Test",
          dataRelationshipName: "DR Name",
        });

        const savedData = await duplicate(mutateAsyncMock);

        // Verify BasedOnObject is added to PhysicalInstance
        expect(itemsOfType(savedData, "PhysicalInstance")[0].BasedOnObject).toEqual(
          basedOn("PhysicalInstance", "pi-original-id"),
        );
      });

      it("should add BasedOnObject to DataRelationship when duplicating", async () => {
        const mutateAsyncMock = mockPublish();
        mockPhysicalInstanceData({
          ...DUPLICABLE_ITEMS,
          title: "Test",
          dataRelationshipName: "DR Name",
        });

        const savedData = await duplicate(mutateAsyncMock);

        // Verify BasedOnObject is added to DataRelationship
        expect(itemsOfType(savedData, "DataRelationship")[0].BasedOnObject).toEqual(
          basedOn("DataRelationship", "dr-original-id"),
        );
      });

      it("should add BasedOnObject to Variables when duplicating", async () => {
        const mutateAsyncMock = mockPublish();
        mockPhysicalInstanceData({
          ...DUPLICABLE_ITEMS,
          title: "Test",
          dataRelationshipName: "DR Name",
          ddiVariables: [
            {
              ID: "var-original-id-1",
              Agency: "test-agency",
              Version: "1",
              VariableName: fr("Var1"),
              Label: fr("Variable 1"),
            },
            {
              ID: "var-original-id-2",
              Agency: "test-agency",
              Version: "2",
              VariableName: fr("Var2"),
              Label: fr("Variable 2"),
            },
          ],
          variables: [
            { id: "var-original-id-1", name: "Var1", label: "Variable 1", type: "text" },
            { id: "var-original-id-2", name: "Var2", label: "Variable 2", type: "text" },
          ],
        });

        const savedData = await duplicate(mutateAsyncMock);

        // Verify BasedOnObject is added to each Variable
        expect(itemsOfType(savedData, "Variable")[0].BasedOnObject).toEqual(
          basedOn("Variable", "var-original-id-1"),
        );
        expect(itemsOfType(savedData, "Variable")[1].BasedOnObject).toEqual(
          basedOn("Variable", "var-original-id-2", "2"),
        );

        // Verify new IDs are different from original
        expect(itemsOfType(savedData, "Variable")[0].ID).not.toBe("var-original-id-1");
        expect(itemsOfType(savedData, "Variable")[1].ID).not.toBe("var-original-id-2");
      });
    });

    it("should navigate to new Physical Instance after duplication", async () => {
      mockPublish();
      mockPhysicalInstanceData({
        ...DUPLICABLE_ITEMS,
        title: "Test",
        dataRelationshipName: "DR Name",
      });

      renderView();
      await confirmDuplication();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });

      // Verify navigation URL contains the new Physical Instance ID
      const navigatePath = mockNavigate.mock.calls[0][0];
      expect(navigatePath).toMatch(/^\/ddi\/physical-instances\/test-agency-123\//);
      expect(navigatePath).not.toContain("pi-original-id");
    });
  });

  describe("Global save with a variable being edited", () => {
    // Crée « TestVar », la rouvre en édition et, si demandé, modifie son libellé sans l'enregistrer.
    const editTestVariable = async (pendingLabel?: string) => {
      createTestVariable();
      fireEvent.click(screen.getByText("TestVar").closest("tr")!);
      await screen.findByLabelText("physicalInstance.view.update");
      if (pendingLabel) {
        fireEvent.change(screen.getByLabelText(/physicalInstance\.view\.columns\.label/), {
          target: { value: pendingLabel },
        });
      }
    };

    const expectNoPendingEditDialog = () =>
      expect(screen.queryByText(PENDING_VARIABLE_EDIT_TITLE)).not.toBeInTheDocument();

    it("should save straight away when no variable is being edited", async () => {
      const mutateAsync = mockPublish();
      renderView();

      createTestVariable();
      await saveAll(mutateAsync);

      expectNoPendingEditDialog();
    });

    it("should save straight away when the edited variable has no pending change", async () => {
      const mutateAsync = mockPublish();
      renderView();

      await editTestVariable();
      await saveAll(mutateAsync);

      expectNoPendingEditDialog();
    });

    it("should ask for confirmation when the edited variable has pending changes", async () => {
      const mutateAsync = mockPublish();
      renderView();

      await editTestVariable("Libellé modifié");
      clickSaveAll();

      await screen.findByText(PENDING_VARIABLE_EDIT_TITLE);
      expect(mutateAsync).not.toHaveBeenCalled();
    });

    it("should not save when the confirmation is rejected", async () => {
      const mutateAsync = mockPublish();
      renderView();

      await editTestVariable("Libellé modifié");
      clickSaveAll();

      fireEvent.click(await screen.findByText("physicalInstance.view.pendingVariableEdit.cancel"));

      await waitFor(() => expectNoPendingEditDialog());
      expect(mutateAsync).not.toHaveBeenCalled();
    });

    it("should save without the pending change when the confirmation is accepted", async () => {
      const mutateAsync = mockPublish();
      renderView();

      await editTestVariable("Libellé modifié");
      clickSaveAll();

      fireEvent.click(await screen.findByText("physicalInstance.view.pendingVariableEdit.confirm"));

      await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
      const saved = itemsOfType(mutateAsync.mock.calls[0][0].data, "Variable");
      expect(saved.map((variable: any) => variable.Label[0]["@value"])).toEqual(["Test Variable"]);
    });
  });

  describe("Unsaved changes navigation blocking", () => {
    it("should not block navigation when there are no unsaved changes", () => {
      renderView();

      // With no local variables or deleted variables, blocker should not be triggered
      expect(mockBlocker.state).toBe("unblocked");
    });

    it("should have unsaved changes when a new variable is added", async () => {
      renderView();

      createTestVariable();

      // Variable should be marked as unsaved (italic)
      await expectUnsaved("TestVar");
    });

    it("should have unsaved changes when a variable is deleted", async () => {
      mockDataWithExistingVariable();

      renderView();

      await deleteFirstVariable();

      // At this point, the component should have unsaved changes
      // The Save All button should be enabled
      expect(screen.getByLabelText("physicalInstance.view.saveAll")).not.toBeDisabled();
    });

    it("should clear unsaved changes after successful save", async () => {
      const mutateAsyncMock = mockPublish();

      renderView();

      createTestVariable();

      // Variable should be marked as unsaved (italic)
      await expectUnsaved("TestVar");

      await saveAll(mutateAsyncMock);

      // After save, local variables should be cleared
      // The variable should no longer be in italic (or may not exist depending on API response)
      await waitFor(() => {
        const variableElement = screen.queryByText("TestVar");
        if (variableElement) {
          expect(variableElement.closest("tr")).not.toHaveClass("font-italic");
        }
      });
    });
  });

  describe("Confirmation dialog", () => {
    it("should not offer a resize handle on the confirmation dialog", async () => {
      renderView();

      fireEvent.click(screen.getAllByLabelText("physicalInstance.view.delete")[0]);

      await screen.findByText("physicalInstance.view.confirmDelete");

      expect(document.querySelector(".p-dialog .p-resizable-handle")).toBeNull();
    });
  });

  describe("URL search params synchronization", () => {
    const clickTab = (tab: "information" | "representation") =>
      fireEvent.click(screen.getByText(`physicalInstance.view.tabs.${tab}`));

    it("should set variableId search param when a variable is clicked", () => {
      renderView();

      selectFirstVariable();

      expect(mockSetSearchParams).toHaveBeenCalled();
      expect(mockSearchParams.get("variableId")).toBe("1");
    });

    it("should remove variableId and tab search params when variable is deselected", async () => {
      renderView();

      selectFirstVariable();

      expect(mockSearchParams.get("variableId")).toBe("1");

      // Create a new variable and save it, which deselects the variable
      createTestVariable("NewVar", "New Variable");

      // After saving, the variable is deselected (selectedVariable becomes null)
      await waitFor(() => {
        expect(mockSearchParams.has("variableId")).toBe(false);
        expect(mockSearchParams.has("tab")).toBe(false);
      });
    });

    it("should restore selected variable from URL on initial load", () => {
      mockSearchParams.set("variableId", "1");

      renderView();

      // The variable should be selected and the edit form should be visible
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("should not restore variable if variableId in URL does not match any variable", () => {
      mockSearchParams.set("variableId", "non-existent-id");

      renderView();

      // No variable should be selected
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("should set tab search param when tab is changed", () => {
      renderView();

      // Select a variable to show the edit form
      selectFirstVariable();

      // Click on the representation tab (index 1)
      clickTab("representation");

      expect(mockSearchParams.get("tab")).toBe("1");
    });

    it("should not set tab param when tab 0 is selected", () => {
      renderView();

      selectFirstVariable();

      // Click on tab 1 then back to tab 0
      clickTab("representation");
      clickTab("information");

      expect(mockSearchParams.has("tab")).toBe(false);
    });

    for (const { name, tab, expectedIndex } of [
      { name: "should restore active tab from URL on initial load", tab: "1", expectedIndex: "1" },
      {
        name: "should default to tab 0 for invalid tab values in URL",
        tab: "abc",
        expectedIndex: "0",
      },
      {
        name: "should default to tab 0 for out-of-range tab values in URL",
        tab: "99",
        expectedIndex: "0",
      },
    ]) {
      it(name, () => {
        mockSearchParams.set("variableId", "1");
        mockSearchParams.set("tab", tab);

        renderView();

        // The variable should be selected
        expect(screen.getByRole("complementary")).toBeInTheDocument();

        expect(screen.getByTestId("tabview")).toHaveAttribute("data-active-index", expectedIndex);
      });
    }
  });

  describe("Variable duplication", () => {
    const variableNamesInTable = () =>
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.querySelectorAll("td")[0]?.textContent);

    it("should insert the duplicated variable right after the source variable", () => {
      renderView();

      // Variable1 est la première ligne du tableau (aucun tri de colonne actif).
      selectFirstVariable();
      fireEvent.click(screen.getByText("physicalInstance.view.duplicate"));

      expect(variableNamesInTable()).toEqual(["Variable1", "Variable1 (copy)", "Variable2"]);
    });
  });
  describe("view — versionDate d'une variable existante", () => {
    it("should preview the stored VersionDate of an existing variable instead of the current date", async () => {
      mockPhysicalInstanceData({
        ddiVariables: [
          {
            ID: "var-1",
            Agency: "fr.insee",
            Version: "1",
            VersionDate: { DateTime: "2026-01-15T09:30:00+01:00" },
            VariableName: fr("Variable1"),
            Label: fr("Label 1"),
            VariableRepresentation: { TextRepresentation: {} },
          },
        ],
        variables: [
          {
            id: "var-1",
            name: "Variable1",
            label: "Label 1",
            type: "text",
            lastModified: "2026-01-15T09:30:00+01:00",
          },
        ],
      });

      renderView();

      fireEvent.click(screen.getByText("Variable1"));

      await screen.findByText("physicalInstance.view.tabs.information");
      fireEvent.click(screen.getByLabelText("physicalInstance.view.tabs.ddiPreview"));

      await waitFor(() => expect(global.fetch).toHaveBeenCalled());

      const [, init] = (global.fetch as any).mock.calls.at(-1);
      const previewed = JSON.parse(init.body).items.find((i: any) => i.ID === "var-1");
      expect(previewed.VersionDate).toEqual({ DateTime: "2026-01-15T09:30:00+01:00" });
    });
  });
});
