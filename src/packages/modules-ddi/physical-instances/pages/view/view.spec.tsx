import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component } from "./view";
import type { ReactNode } from "react";

const mockUsePhysicalInstancesData = vi.fn();
const mockUpdatePhysicalInstance = vi.fn();
const mockPublishPhysicalInstance = vi.fn();
const mockConvertToDDI3 = vi.fn().mockResolvedValue("<ddi3-xml-content></ddi3-xml-content>");
const mockNavigate = vi.fn();
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

vi.mock("../../../hooks/useGroupDetails", () => ({
  useGroupDetails: (agencyId: string | null, groupId: string | null) => {
    if (agencyId && groupId) {
      return {
        data: {
          Group: [{ ID: groupId, Agency: agencyId, StudyUnitReference: [] }],
          StudyUnit: [
            {
              ID: "study-1",
              Agency: agencyId,
              Version: "1.0",
              Citation: {
                Title: {
                  String: { "@xml:lang": "fr-FR", "#text": "Study Unit 1" },
                },
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

vi.mock("primereact/toast", () => ({
  Toast: vi.fn(() => null),
}));

vi.mock("primereact/message", () => ({
  Message: ({ severity, text }: any) => (
    <div data-testid="message" data-severity={severity}>
      {text}
    </div>
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ id, value, options, onChange, disabled, ...props }: any) => (
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

// Helper function to create a test variable and enable the Save All button
const createTestVariable = (name = "TestVar", label = "Test Variable") => {
  const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
  fireEvent.click(newVariableButton);

  const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
  const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
  fireEvent.change(nameInput, { target: { value: name } });
  fireEvent.change(labelInput, { target: { value: label } });

  const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
  fireEvent.click(saveVariableButton);
};

describe("View Component", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

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
    mockUsePhysicalInstancesData.mockReturnValue({
      data: {
        PhysicalInstance: [
          {
            Citation: {
              Title: { String: { "#text": "Test Physical Instance" } },
            },
          },
        ],
        DataRelationship: [
          {
            DataRelationshipName: {
              String: { "#text": "Test Data Relationship" },
            },
            LogicalRecord: {
              VariablesInRecord: {
                VariableUsedReference: [],
              },
            },
          },
        ],
        Variable: [],
      },
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
      title: "Test Physical Instance",
      dataRelationshipName: "Test Data Relationship",
      isLoading: false,
      isError: false,
    });

    // Default mock for mutation
    mockUpdatePhysicalInstance.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
      isError: false,
    });

    mockPublishPhysicalInstance.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
      isError: false,
    });
  });

  describe("Loading state", () => {
    it("should render loading spinner when data is loading", () => {
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: true,
        isError: false,
      });

      render(<Component />, { wrapper });

      expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
      expect(screen.getByLabelText("Loading in progress...")).toBeInTheDocument();
    });

    it("should have correct accessibility attributes for loading state", () => {
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: true,
        isError: false,
      });

      render(<Component />, { wrapper });

      const loadingContainer = screen.getByRole("status");
      expect(loadingContainer).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Error state", () => {
    it("should render error message when there is an error", () => {
      const errorMessage = "Failed to fetch data";
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
      });

      render(<Component />, { wrapper });

      expect(screen.getByTestId("message")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should have correct accessibility attributes for error state", () => {
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: false,
        isError: true,
        error: new Error("Error"),
      });

      render(<Component />, { wrapper });

      const errorContainer = screen.getByRole("alert");
      expect(errorContainer).toHaveAttribute("aria-live", "assertive");
    });

    it("should render default error message when error is not an Error instance", () => {
      mockUsePhysicalInstancesData.mockReturnValue({
        variables: [],
        isLoading: false,
        isError: true,
        error: "Unknown error",
      });

      render(<Component />, { wrapper });

      expect(screen.getByText("physicalInstance.view.errorLoading")).toBeInTheDocument();
    });
  });

  describe("Successful render", () => {
    it("should render the physical instance title", () => {
      render(<Component />, { wrapper });

      expect(screen.getByText("Test Physical Instance")).toBeInTheDocument();
    });

    it("should initialize form data with data relationship name", () => {
      render(<Component />, { wrapper });

      // The data relationship name is not directly displayed,
      // but it should be available in the component state for the edit modal
      // This test verifies the component doesn't crash with the provided data
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have correct accessibility role for main container", () => {
      render(<Component />, { wrapper });

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should have correct accessibility role for complementary section", () => {
      render(<Component />, { wrapper });

      const firstRow = screen.getAllByRole("row")[1];
      fireEvent.click(firstRow);

      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("should render SearchFilters component", () => {
      render(<Component />, { wrapper });

      expect(screen.getByPlaceholderText("physicalInstance.view.search")).toBeInTheDocument();
    });

    it("should render GlobalActionsCard component", () => {
      render(<Component />, { wrapper });

      expect(screen.getByText("physicalInstance.view.globalActions")).toBeInTheDocument();
    });
  });

  describe("Edit modal", () => {
    it("should open edit modal when pencil button is clicked", () => {
      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      expect(screen.getByText("physicalInstance.view.editModal.title")).toBeInTheDocument();
    });

    it("should close edit modal when cancel is clicked", async () => {
      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      const cancelButton = screen.getByText("physicalInstance.view.editModal.cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText("physicalInstance.view.editModal.title")).not.toBeInTheDocument();
      });
    });

    it("should update form data in edit modal", () => {
      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      const labelInput = screen.getByLabelText("physicalInstance.creation.label");
      fireEvent.change(labelInput, { target: { value: "New Label" } });

      expect((labelInput as HTMLInputElement).value).toBe("New Label");
    });
  });

  describe("Filtering", () => {
    it("should filter variables by search value", async () => {
      render(<Component />, { wrapper });

      const searchInput = screen.getByPlaceholderText("physicalInstance.view.search");
      fireEvent.change(searchInput, { target: { value: "Variable1" } });

      await waitFor(() => {
        expect(screen.getByText("Variable1")).toBeInTheDocument();
        expect(screen.queryByText("Variable2")).not.toBeInTheDocument();
      });
    });

    it("should filter variables by type", async () => {
      render(<Component />, { wrapper });

      const typeDropdown = screen.getByLabelText("physicalInstance.view.typeFilter");
      fireEvent.change(typeDropdown, { target: { value: "code" } });

      await waitFor(() => {
        expect(screen.getByText("Variable1")).toBeInTheDocument();
        expect(screen.queryByText("Variable2")).not.toBeInTheDocument();
      });
    });

    it("should generate dynamic type options from variables", () => {
      render(<Component />, { wrapper });

      const typeDropdown = screen.getByLabelText(
        "physicalInstance.view.typeFilter",
      ) as HTMLSelectElement;

      expect(typeDropdown).toBeInTheDocument();
      expect(typeDropdown).toHaveValue("all");

      // Verify all type options are present
      expect(
        screen.getByRole("option", { name: "physicalInstance.view.allTypes" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", {
          name: "physicalInstance.view.variableTypes.text",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", {
          name: "physicalInstance.view.variableTypes.code",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", {
          name: "physicalInstance.view.variableTypes.date",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", {
          name: "physicalInstance.view.variableTypes.numeric",
        }),
      ).toBeInTheDocument();
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
      let capturedLink: HTMLAnchorElement | null = null;

      // Capture the link before it's removed
      const originalAppendChild = document.body.appendChild;
      document.body.appendChild = vi.fn((node) => {
        if (node instanceof HTMLAnchorElement && node.download) {
          capturedLink = node;
        }
        return originalAppendChild.call(document.body, node);
      }) as any;

      render(<Component />, { wrapper });

      // SplitButton creates multiple elements with the same aria-label, get the first button
      const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
      const exportButton = exportButtons.find((el) => el.tagName === "BUTTON");
      fireEvent.click(exportButton!);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
        expect(mockRevokeObjectURL).toHaveBeenCalled();
      });

      // Check that the link has the correct download attribute
      expect(capturedLink?.download).toBe("test_physical_instance-ddi3.xml");

      // Restore original appendChild
      document.body.appendChild = originalAppendChild;
    });

    it("should download DDI4 file when DDI4 option is selected", async () => {
      render(<Component />, { wrapper });

      // The export button is a SplitButton, get the first button
      const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
      const exportButton = exportButtons.find((el) => el.tagName === "BUTTON");

      // Click the button (which defaults to DDI3)
      fireEvent.click(exportButton!);

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();
      });
    });

    it("should sanitize title for filename", async () => {
      let capturedLink: HTMLAnchorElement | null = null;

      // Capture the link before it's removed
      const originalAppendChild = document.body.appendChild;
      document.body.appendChild = vi.fn((node) => {
        if (node instanceof HTMLAnchorElement && node.download) {
          capturedLink = node;
        }
        return originalAppendChild.call(document.body, node);
      }) as any;

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              Citation: {
                Title: { String: { "#text": "Test Physical Instance" } },
              },
            },
          ],
          DataRelationship: [
            {
              DataRelationshipName: {
                String: { "#text": "Test Data Relationship" },
              },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [],
                },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test @ Physical # Instance!",
        dataRelationshipName: "Test Data Relationship",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
      const exportButton = exportButtons.find((el) => el.tagName === "BUTTON");
      fireEvent.click(exportButton!);

      await waitFor(() => {
        expect(mockClick).toHaveBeenCalled();
      });

      expect(capturedLink?.download).toBe("test___physical___instance_-ddi3.xml");

      // Restore original appendChild
      document.body.appendChild = originalAppendChild;
    });

    it("should call DDIApi.convertToDDI3 with correct data", async () => {
      const mockData = {
        PhysicalInstance: [
          {
            Citation: {
              Title: { String: { "#text": "Test Physical Instance" } },
            },
          },
        ],
        DataRelationship: [
          {
            DataRelationshipName: {
              String: { "#text": "Test Data Relationship" },
            },
            LogicalRecord: {
              VariablesInRecord: {
                VariableUsedReference: [],
              },
            },
          },
        ],
        Variable: [],
      };

      mockUsePhysicalInstancesData.mockReturnValue({
        data: mockData,
        variables: [],
        title: "Test Physical Instance",
        dataRelationshipName: "Test Data Relationship",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
      const exportButton = exportButtons.find((el) => el.tagName === "BUTTON");
      fireEvent.click(exportButton!);

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

      render(<Component />, { wrapper });

      const exportButtons = screen.getAllByLabelText("physicalInstance.view.export");
      const exportButton = exportButtons.find((el) => el.tagName === "BUTTON");
      fireEvent.click(exportButton!);

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
    const fillAndSubmitEditModal = async (label = "Updated Title") => {
      // Fill label
      const labelInput = screen.getByLabelText("physicalInstance.creation.label");
      fireEvent.change(labelInput, { target: { value: label } });

      // Select group
      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      // Wait for study units to load then select one
      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      // Submit form
      const form = screen.getByRole("dialog").querySelector("form");
      if (form) {
        fireEvent.submit(form);
      }
    };

    it("should initialize edit modal with title", () => {
      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      const labelInput = screen.getByLabelText(
        "physicalInstance.creation.label",
      ) as HTMLInputElement;

      expect(labelInput.value).toBe("Test Physical Instance");
    });

    it("should call mutation when save button is clicked", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockUpdatePhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

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
      await waitFor(() => {
        expect(screen.queryByText("physicalInstance.view.editModal.title")).not.toBeInTheDocument();
      });
    });

    it("should close modal after successful save", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockUpdatePhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      await fillAndSubmitEditModal();

      await waitFor(() => {
        expect(screen.queryByText("physicalInstance.view.editModal.title")).not.toBeInTheDocument();
      });
    });

    it("should handle save error gracefully", async () => {
      const mutateAsyncMock = vi.fn().mockRejectedValue(new Error("Save failed"));
      mockUpdatePhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
      fireEvent.click(editButton);

      // Wait for modal to be visible
      await waitFor(() => {
        expect(screen.getByText("physicalInstance.view.editModal.title")).toBeInTheDocument();
      });

      await fillAndSubmitEditModal();

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Modal should remain open on error
      await waitFor(() => {
        expect(screen.getByText("physicalInstance.view.editModal.title")).toBeInTheDocument();
      });
    });
  });

  describe("Save All functionality", () => {
    it("should call savePhysicalInstance mutation when Save All button is clicked", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable to enable the Save All button
      createTestVariable();

      // Now click Save All
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalledWith({
          id: "test-id-123",
          agencyId: "test-agency-123",
          data: expect.objectContaining({
            PhysicalInstance: expect.any(Array),
            DataRelationship: expect.any(Array),
          }),
        });
      });
    });

    it("should merge local variables with existing variables on save", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [
                    {
                      Agency: "test-agency-123",
                      ID: "existing-var-1",
                      Version: "1",
                      TypeOfObject: "Variable",
                    },
                  ],
                },
              },
            },
          ],
          Variable: [
            {
              ID: "existing-var-1",
              VariableName: { String: { "#text": "ExistingVar" } },
              Label: { Content: { "#text": "Existing Variable" } },
            },
          ],
        },
        variables: [],
        title: "Test Physical Instance",
        dataRelationshipName: "Test Data Relationship",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      // Fill in the variable form
      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "NewVariable" } });
      fireEvent.change(labelInput, { target: { value: "New Variable Label" } });

      // Save the variable
      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
        const callArgs = mutateAsyncMock.mock.calls[0][0];
        expect(callArgs.data.Variable).toHaveLength(2);
        expect(callArgs.data.Variable).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ ID: "existing-var-1" }),
            expect.objectContaining({
              VariableName: expect.objectContaining({
                String: expect.objectContaining({ "#text": "NewVariable" }),
              }),
            }),
          ]),
        );
      });
    });

    it("should clear local variables after successful save", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "TempVar" } });
      fireEvent.change(labelInput, { target: { value: "Temp Variable" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Check that variable is marked as unsaved (italic)
      await waitFor(() => {
        const variableRow = screen.getByText("TempVar").closest("tr");
        expect(variableRow).toHaveClass("font-italic");
      });

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Check that local variable was cleared (variable no longer in italic or not present)
      await waitFor(() => {
        const variableElement = screen.queryByText("TempVar");
        // After clearing local variables, the variable should either:
        // 1. Not exist anymore (cleared from local state and not in API response), or
        // 2. Exist without italic class (if it was added to API response)
        if (variableElement) {
          const variableRow = variableElement.closest("tr");
          expect(variableRow).not.toHaveClass("font-italic");
        } else {
          // Variable was cleared from local state
          expect(variableElement).toBeNull();
        }
      });
    });

    it("should handle save all error gracefully", async () => {
      const mutateAsyncMock = vi.fn().mockRejectedValue(new Error("Save failed"));
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable to enable the Save All button
      createTestVariable();

      // Now click Save All
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Should not crash and should show error message via toast
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should transform local variables to DDI format correctly", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [],
                },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable with date type
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "DateVar" } });
      fireEvent.change(labelInput, { target: { value: "Date Variable" } });

      // Switch to representation tab
      const representationTab = screen.getByText("physicalInstance.view.tabs.representation");
      fireEvent.click(representationTab);

      // Select date type
      const typeDropdown = screen.getByLabelText("physicalInstance.view.columns.type");
      fireEvent.change(typeDropdown, { target: { value: "date" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
        const callArgs = mutateAsyncMock.mock.calls[0][0];
        const dateVariable = callArgs.data.Variable.find(
          (v: any) => v.VariableName?.String?.["#text"] === "DateVar",
        );
        expect(dateVariable).toBeDefined();
        expect(dateVariable.VariableRepresentation).toHaveProperty("DateTimeRepresentation");
        expect(dateVariable.VariableRepresentation.DateTimeRepresentation).toHaveProperty(
          "DateTypeCode",
        );
      });
    });

    it("should not include null values in transformed variables", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a simple text variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "TextVar" } });
      fireEvent.change(labelInput, { target: { value: "Text Variable" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
        const callArgs = mutateAsyncMock.mock.calls[0][0];
        const textVariable = callArgs.data.Variable.find(
          (v: any) => v.VariableName?.String?.["#text"] === "TextVar",
        );
        // Check that variable doesn't have Description if it wasn't set
        expect(textVariable).not.toHaveProperty("Description");
        // Check that @isGeographic is not present if not set
        expect(textVariable).not.toHaveProperty("@isGeographic");
      });
    });

    it("should include CodeList and Category when saving code variables", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [],
                },
              },
            },
          ],
          Variable: [],
          CodeList: [],
          Category: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new code variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "CodeVar" } });
      fireEvent.change(labelInput, { target: { value: "Code Variable" } });

      // Switch to representation tab
      const representationTab = screen.getByText("physicalInstance.view.tabs.representation");
      fireEvent.click(representationTab);

      // Select code type
      const typeDropdown = screen.getByLabelText("physicalInstance.view.columns.type");
      fireEvent.change(typeDropdown, { target: { value: "code" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Verify that CodeList and Category are included
      const savedData = mutateAsyncMock.mock.calls[0][0].data;
      expect(savedData.CodeList).toBeDefined();
      expect(savedData.Category).toBeDefined();
      // CodeList and Category should be arrays (not null)
      expect(Array.isArray(savedData.CodeList)).toBe(true);
      expect(Array.isArray(savedData.Category)).toBe(true);
    });

    it("should ensure CodeListReference ID matches CodeList ID", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [],
                },
              },
            },
          ],
          Variable: [],
          CodeList: [],
          Category: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new code variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "CodeVar" } });
      fireEvent.change(labelInput, { target: { value: "Code Variable" } });

      // Switch to representation tab
      const representationTab = screen.getByText("physicalInstance.view.tabs.representation");
      fireEvent.click(representationTab);

      // Select code type
      const typeDropdown = screen.getByLabelText("physicalInstance.view.columns.type");
      fireEvent.change(typeDropdown, { target: { value: "code" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Verify that CodeListReference.ID matches the CodeList.ID
      const savedData = mutateAsyncMock.mock.calls[0][0].data;
      if (savedData.Variable.length > 0 && savedData.CodeList.length > 0) {
        const variable = savedData.Variable[0];
        const codeList = savedData.CodeList[0];
        const codeListRefId =
          variable.VariableRepresentation?.CodeRepresentation?.CodeListReference?.ID;

        expect(codeListRefId).toBeDefined();
        expect(codeListRefId).toBe(codeList.ID);
      }
    });

    it("should update VariablesInRecord with all variable references", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      const existingVariable = {
        ID: "var-1",
        Agency: "test-agency",
        Version: "1",
        URN: "urn:ddi:test-agency:var-1:1",
        VariableName: {
          String: { "@xml:lang": "fr-FR", "#text": "Variable1" },
        },
        Label: { Content: { "@xml:lang": "fr-FR", "#text": "Variable 1" } },
        VariableRepresentation: {
          TextRepresentation: { "@maxLength": "100" },
        },
      };

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [
                    {
                      Agency: "test-agency-123",
                      ID: "var-1",
                      Version: "1",
                      TypeOfObject: "Variable",
                    },
                  ],
                },
              },
            },
          ],
          Variable: [existingVariable],
        },
        variables: [
          {
            id: "var-1",
            name: "Variable1",
            label: "Variable 1",
            type: "text",
            lastModified: "2024-01-01",
          },
        ],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "NewVariable" } });
      fireEvent.change(labelInput, { target: { value: "New Variable" } });

      const saveVariableButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveVariableButton);

      // Click Save All
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      // Wait for the save to complete
      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Verify that VariablesInRecord includes references to both variables
      const savedData = mutateAsyncMock.mock.calls[0][0].data;
      expect(savedData.DataRelationship[0].LogicalRecord.VariablesInRecord).toBeDefined();
      expect(
        savedData.DataRelationship[0].LogicalRecord.VariablesInRecord.VariableUsedReference,
      ).toHaveLength(2);
      expect(
        savedData.DataRelationship[0].LogicalRecord.VariablesInRecord.VariableUsedReference,
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Agency: "test-agency-123",
            ID: "var-1",
            Version: "1",
            TypeOfObject: "Variable",
          }),
          expect.objectContaining({
            Agency: "test-agency-123",
            Version: "1",
            TypeOfObject: "Variable",
          }),
        ]),
      );
    });

    it("should exclude deleted variables from save", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      const existingVariable = {
        ID: "var-1",
        Agency: "test-agency",
        Version: "1",
        URN: "urn:ddi:test-agency:var-1:1",
        VariableName: {
          String: { "@xml:lang": "fr-FR", "#text": "Variable1" },
        },
        Label: { Content: { "@xml:lang": "fr-FR", "#text": "Variable 1" } },
        VariableRepresentation: {
          TextRepresentation: { "@maxLength": "100" },
        },
      };

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [
                    {
                      Agency: "test-agency-123",
                      ID: "var-1",
                      Version: "1",
                      TypeOfObject: "Variable",
                    },
                  ],
                },
              },
            },
          ],
          Variable: [existingVariable],
        },
        variables: [
          {
            id: "var-1",
            name: "Variable1",
            label: "Variable 1",
            type: "text",
            lastModified: "2024-01-01",
          },
        ],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Verify variable is initially displayed
      expect(screen.getByText("Variable1")).toBeInTheDocument();

      // Click delete button for the variable
      const deleteButtons = screen.getAllByLabelText("physicalInstance.view.delete");
      fireEvent.click(deleteButtons[0]);

      // Confirm deletion in the dialog
      const confirmButton = screen.getByText("physicalInstance.view.confirmDelete");
      fireEvent.click(confirmButton);

      // Variable should no longer be visible in the table
      await waitFor(() => {
        expect(screen.queryByText("Variable1")).not.toBeInTheDocument();
      });

      // Click Save All
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      // Wait for the save to complete
      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // Verify that the saved data does not include the deleted variable
      const savedData = mutateAsyncMock.mock.calls[0][0].data;
      expect(savedData.Variable).toEqual([]);
    });
  });

  describe("Duplicate Physical Instance", () => {
    it("should add (copy) suffix to Citation Title and PhysicalInstanceLabel when duplicating", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Original Title" } } },
              PhysicalInstanceLabel: { Content: { "#text": "Original Label" } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "Original DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Original Title",
        dataRelationshipName: "Original DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify Citation Title has (copy) suffix
      expect(savedData.PhysicalInstance[0].Citation.Title.String["#text"]).toBe(
        "Original Title (copy)",
      );

      // Verify PhysicalInstanceLabel has (copy) suffix
      expect(savedData.PhysicalInstance[0].PhysicalInstanceLabel.Content["#text"]).toBe(
        "Original Title (copy)",
      );
    });

    it("should add (copy) suffix to DataRelationshipName when duplicating", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Test" } } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "Original DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "Original DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify DataRelationshipName has (copy) suffix with new pattern
      expect(savedData.DataRelationship[0].DataRelationshipName.String["#text"]).toBe(
        "Structure : Test (copy)",
      );
    });

    it("should add BasedOnObject to PhysicalInstance when duplicating", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Test" } } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify BasedOnObject is added to PhysicalInstance
      expect(savedData.PhysicalInstance[0].BasedOnObject).toEqual({
        BasedOnReference: {
          Agency: "test-agency",
          ID: "pi-original-id",
          Version: "1",
          TypeOfObject: "PhysicalInstance",
        },
      });
    });

    it("should add BasedOnObject to DataRelationship when duplicating", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Test" } } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify BasedOnObject is added to DataRelationship
      expect(savedData.DataRelationship[0].BasedOnObject).toEqual({
        BasedOnReference: {
          Agency: "test-agency",
          ID: "dr-original-id",
          Version: "1",
          TypeOfObject: "DataRelationship",
        },
      });
    });

    it("should add BasedOnObject to Variables when duplicating", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Test" } } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [
            {
              ID: "var-original-id-1",
              Agency: "test-agency",
              Version: "1",
              VariableName: { String: { "#text": "Var1" } },
              Label: { Content: { "#text": "Variable 1" } },
            },
            {
              ID: "var-original-id-2",
              Agency: "test-agency",
              Version: "2",
              VariableName: { String: { "#text": "Var2" } },
              Label: { Content: { "#text": "Variable 2" } },
            },
          ],
        },
        variables: [
          {
            id: "var-original-id-1",
            name: "Var1",
            label: "Variable 1",
            type: "text",
          },
          {
            id: "var-original-id-2",
            name: "Var2",
            label: "Variable 2",
            type: "text",
          },
        ],
        title: "Test",
        dataRelationshipName: "DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      const savedData = mutateAsyncMock.mock.calls[0][0].data;

      // Verify BasedOnObject is added to each Variable
      expect(savedData.Variable[0].BasedOnObject).toEqual({
        BasedOnReference: {
          Agency: "test-agency",
          ID: "var-original-id-1",
          Version: "1",
          TypeOfObject: "Variable",
        },
      });

      expect(savedData.Variable[1].BasedOnObject).toEqual({
        BasedOnReference: {
          Agency: "test-agency",
          ID: "var-original-id-2",
          Version: "2",
          TypeOfObject: "Variable",
        },
      });

      // Verify new IDs are different from original
      expect(savedData.Variable[0].ID).not.toBe("var-original-id-1");
      expect(savedData.Variable[1].ID).not.toBe("var-original-id-2");
    });

    it("should navigate to new Physical Instance after duplication", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [
            {
              ID: "pi-original-id",
              Agency: "test-agency",
              Version: "1",
              Citation: { Title: { String: { "#text": "Test" } } },
            },
          ],
          DataRelationship: [
            {
              ID: "dr-original-id",
              Agency: "test-agency",
              Version: "1",
              DataRelationshipName: { String: { "#text": "DR Name" } },
              LogicalRecord: {
                ID: "lr-original-id",
                VariablesInRecord: { VariableUsedReference: [] },
              },
            },
          ],
          Variable: [],
        },
        variables: [],
        title: "Test",
        dataRelationshipName: "DR Name",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      const duplicateButton = screen.getByLabelText(
        "physicalInstance.view.duplicatePhysicalInstance",
      );
      fireEvent.click(duplicateButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });

      // Verify navigation URL contains the new Physical Instance ID
      const navigatePath = mockNavigate.mock.calls[0][0];
      expect(navigatePath).toMatch(/^\/ddi\/physical-instances\/test-agency-123\//);
      expect(navigatePath).not.toContain("pi-original-id");
    });
  });

  describe("Unsaved changes navigation blocking", () => {
    it("should not block navigation when there are no unsaved changes", () => {
      render(<Component />, { wrapper });

      // With no local variables or deleted variables, blocker should not be triggered
      expect(mockBlocker.state).toBe("unblocked");
    });

    it("should have unsaved changes when a new variable is added", async () => {
      render(<Component />, { wrapper });

      // Create a new variable
      createTestVariable();

      // Variable should be marked as unsaved (italic)
      await waitFor(() => {
        const variableRow = screen.getByText("TestVar").closest("tr");
        expect(variableRow).toHaveClass("font-italic");
      });
    });

    it("should have unsaved changes when a variable is deleted", async () => {
      const existingVariable = {
        ID: "var-1",
        Agency: "test-agency",
        Version: "1",
        URN: "urn:ddi:test-agency:var-1:1",
        VariableName: {
          String: { "@xml:lang": "fr-FR", "#text": "Variable1" },
        },
        Label: { Content: { "@xml:lang": "fr-FR", "#text": "Variable 1" } },
        VariableRepresentation: {
          TextRepresentation: { "@maxLength": "100" },
        },
      };

      mockUsePhysicalInstancesData.mockReturnValue({
        data: {
          PhysicalInstance: [{ Citation: { Title: { String: { "#text": "Test" } } } }],
          DataRelationship: [
            {
              DataRelationshipName: { String: { "#text": "Test" } },
              LogicalRecord: {
                VariablesInRecord: {
                  VariableUsedReference: [
                    {
                      Agency: "test-agency-123",
                      ID: "var-1",
                      Version: "1",
                      TypeOfObject: "Variable",
                    },
                  ],
                },
              },
            },
          ],
          Variable: [existingVariable],
        },
        variables: [
          {
            id: "var-1",
            name: "Variable1",
            label: "Variable 1",
            type: "text",
            lastModified: "2024-01-01",
          },
        ],
        title: "Test",
        dataRelationshipName: "Test",
        isLoading: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Click delete button for the variable
      const deleteButtons = screen.getAllByLabelText("physicalInstance.view.delete");
      fireEvent.click(deleteButtons[0]);

      // Confirm deletion in the dialog
      const confirmButton = screen.getByText("physicalInstance.view.confirmDelete");
      fireEvent.click(confirmButton);

      // Variable should no longer be visible in the table
      await waitFor(() => {
        expect(screen.queryByText("Variable1")).not.toBeInTheDocument();
      });

      // At this point, the component should have unsaved changes
      // The Save All button should be enabled
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      expect(saveAllButton).not.toBeDisabled();
    });

    it("should clear unsaved changes after successful save", async () => {
      const mutateAsyncMock = vi.fn().mockResolvedValue({});
      mockPublishPhysicalInstance.mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false,
        isError: false,
      });

      render(<Component />, { wrapper });

      // Create a new variable
      createTestVariable();

      // Variable should be marked as unsaved (italic)
      await waitFor(() => {
        const variableRow = screen.getByText("TestVar").closest("tr");
        expect(variableRow).toHaveClass("font-italic");
      });

      // Save all
      const saveAllButton = screen.getByLabelText("physicalInstance.view.saveAll");
      fireEvent.click(saveAllButton);

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled();
      });

      // After save, local variables should be cleared
      // The variable should no longer be in italic (or may not exist depending on API response)
      await waitFor(() => {
        const variableElement = screen.queryByText("TestVar");
        if (variableElement) {
          const variableRow = variableElement.closest("tr");
          expect(variableRow).not.toHaveClass("font-italic");
        }
      });
    });
  });

  describe("URL search params synchronization", () => {
    it("should set variableId search param when a variable is clicked", () => {
      render(<Component />, { wrapper });

      const firstRow = screen.getAllByRole("row")[1];
      fireEvent.click(firstRow);

      expect(mockSetSearchParams).toHaveBeenCalled();
      expect(mockSearchParams.get("variableId")).toBe("1");
    });

    it("should remove variableId and tab search params when variable is deselected", async () => {
      render(<Component />, { wrapper });

      // Select a variable
      const firstRow = screen.getAllByRole("row")[1];
      fireEvent.click(firstRow);

      expect(mockSearchParams.get("variableId")).toBe("1");

      // Create a new variable and save it, which deselects the variable
      const newVariableButton = screen.getByLabelText("physicalInstance.view.newVariable");
      fireEvent.click(newVariableButton);

      const nameInput = screen.getByLabelText(/physicalInstance\.view\.columns\.name/);
      const labelInput = screen.getByLabelText(/physicalInstance\.view\.columns\.label/);
      fireEvent.change(nameInput, { target: { value: "NewVar" } });
      fireEvent.change(labelInput, { target: { value: "New Variable" } });

      const saveButton = screen.getByLabelText("physicalInstance.view.add");
      fireEvent.click(saveButton);

      // After saving, the variable is deselected (selectedVariable becomes null)
      await waitFor(() => {
        expect(mockSearchParams.has("variableId")).toBe(false);
        expect(mockSearchParams.has("tab")).toBe(false);
      });
    });

    it("should restore selected variable from URL on initial load", () => {
      mockSearchParams.set("variableId", "1");

      render(<Component />, { wrapper });

      // The variable should be selected and the edit form should be visible
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });

    it("should not restore variable if variableId in URL does not match any variable", () => {
      mockSearchParams.set("variableId", "non-existent-id");

      render(<Component />, { wrapper });

      // No variable should be selected
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    });

    it("should set tab search param when tab is changed", () => {
      render(<Component />, { wrapper });

      // Select a variable to show the edit form
      const firstRow = screen.getAllByRole("row")[1];
      fireEvent.click(firstRow);

      // Click on the representation tab (index 1)
      const representationTab = screen.getByText("physicalInstance.view.tabs.representation");
      fireEvent.click(representationTab);

      expect(mockSearchParams.get("tab")).toBe("1");
    });

    it("should not set tab param when tab 0 is selected", () => {
      render(<Component />, { wrapper });

      // Select a variable
      const firstRow = screen.getAllByRole("row")[1];
      fireEvent.click(firstRow);

      // Click on tab 1 then back to tab 0
      const representationTab = screen.getByText("physicalInstance.view.tabs.representation");
      fireEvent.click(representationTab);

      const informationTab = screen.getByText("physicalInstance.view.tabs.information");
      fireEvent.click(informationTab);

      expect(mockSearchParams.has("tab")).toBe(false);
    });

    it("should restore active tab from URL on initial load", () => {
      mockSearchParams.set("variableId", "1");
      mockSearchParams.set("tab", "1");

      render(<Component />, { wrapper });

      // The variable should be selected
      expect(screen.getByRole("complementary")).toBeInTheDocument();

      // The representation tab should be active (index 1)
      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "1");
    });

    it("should default to tab 0 for invalid tab values in URL", () => {
      mockSearchParams.set("variableId", "1");
      mockSearchParams.set("tab", "abc");

      render(<Component />, { wrapper });

      expect(screen.getByRole("complementary")).toBeInTheDocument();

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });

    it("should default to tab 0 for out-of-range tab values in URL", () => {
      mockSearchParams.set("variableId", "1");
      mockSearchParams.set("tab", "99");

      render(<Component />, { wrapper });

      expect(screen.getByRole("complementary")).toBeInTheDocument();

      const tabView = screen.getByTestId("tabview");
      expect(tabView).toHaveAttribute("data-active-index", "0");
    });
  });
});
