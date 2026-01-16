import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhysicalInstanceDialog } from "./PhysicalInstanceCreationDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.creation.title": "Create a new physical instance",
        "physicalInstance.creation.label": "Label",
        "physicalInstance.creation.group": "Group",
        "physicalInstance.creation.studyUnit": "Study Unit",
        "physicalInstance.creation.selectGroup": "Select a group",
        "physicalInstance.creation.selectStudyUnit": "Select a study unit",
        "physicalInstance.creation.cancel": "Cancel",
        "physicalInstance.creation.create": "Create",
        "physicalInstance.view.editModal.title": "Edit",
        "physicalInstance.view.editModal.cancel": "Cancel",
        "physicalInstance.view.editModal.save": "Save",
      };
      return translations[key] || key;
    },
  }),
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
      {
        id: "group-2",
        label: "Group 2",
        agency: "agency-2",
        versionDate: "2024-01-02",
      },
    ],
    isLoading: false,
  }),
}));

vi.mock("../../../hooks/useGroupDetails", () => ({
  useGroupDetails: (agencyId: string | null, groupId: string | null) => {
    if (agencyId === "agency-1" && groupId === "group-1") {
      return {
        data: {
          Group: [{ ID: "group-1", Agency: "agency-1", StudyUnitReference: [] }],
          StudyUnit: [
            {
              ID: "study-1",
              Agency: "agency-1",
              Version: "1.0",
              Citation: {
                Title: {
                  String: { "@xml:lang": "en", "#text": "Study Unit 1" },
                },
              },
            },
            {
              ID: "study-2",
              Agency: "agency-1",
              Version: "1.0",
              Citation: {
                Title: {
                  String: { "@xml:lang": "en", "#text": "Study Unit 2" },
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

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, ...props }: any) => (
    <input id={id} value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ id, value, options, onChange, placeholder, disabled, className }: any) => (
    <select
      id={id}
      value={value || ""}
      onChange={(e) => onChange({ value: e.target.value || null })}
      disabled={disabled}
      className={className}
      data-testid={`dropdown-${id}`}
    >
      <option value="">{placeholder}</option>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, type = "button", className, disabled, loading }: any) => (
    <button type={type} onClick={onClick} className={className} disabled={disabled || loading}>
      {label}
    </button>
  ),
}));

vi.mock("primereact/dialog", () => ({
  Dialog: ({ header, visible, children, onHide, className }: any) => {
    if (!visible) return null;
    return (
      <div className={className} data-testid="dialog">
        <h2>{header}</h2>
        <button type="button" onClick={onHide} data-testid="close-button">
          Close
        </button>
        {children}
      </div>
    );
  },
}));

describe("PhysicalInstanceDialog", () => {
  const mockOnHide = vi.fn();
  const mockOnSubmitCreate = vi.fn();
  const mockOnSubmitEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create mode", () => {
    const defaultCreateProps = {
      visible: true,
      onHide: mockOnHide,
      mode: "create" as const,
      onSubmitCreate: mockOnSubmitCreate,
    };

    it("should render the dialog in create mode when visible is true", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      expect(screen.getByText("Create a new physical instance")).toBeInTheDocument();
      expect(screen.getByLabelText("Label")).toBeInTheDocument();
      expect(screen.getByLabelText("Group")).toBeInTheDocument();
      expect(screen.getByLabelText("Study Unit")).toBeInTheDocument();
    });

    it("should not render the dialog when visible is false", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} visible={false} />);

      expect(screen.queryByText("Create a new physical instance")).not.toBeInTheDocument();
    });

    it("should have create button disabled when form is incomplete", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const createButton = screen.getByText("Create");
      expect(createButton).toBeDisabled();
    });

    it("should enable create button when all fields are filled", async () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const labelInput = screen.getByLabelText("Label");
      fireEvent.change(labelInput, { target: { value: "Test Label" } });

      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      await waitFor(() => {
        const createButton = screen.getByText("Create");
        expect(createButton).not.toBeDisabled();
      });
    });

    it("should call onSubmitCreate with correct data when form is submitted", async () => {
      mockOnSubmitCreate.mockResolvedValue(undefined);
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const labelInput = screen.getByLabelText("Label");
      fireEvent.change(labelInput, { target: { value: "Test Label" } });

      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      const createButton = screen.getByText("Create");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockOnSubmitCreate).toHaveBeenCalledWith({
          label: "Test Label",
          name: "DataRelationShip Name:Test Label",
          group: { id: "group-1", agency: "agency-1" },
          studyUnit: { id: "study-1", agency: "agency-1" },
        });
      });
    });

    it("should call onHide when cancel button is clicked", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockOnHide).toHaveBeenCalledTimes(1);
    });

    it("should disable study unit dropdown when no group is selected", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      expect(studyUnitDropdown).toBeDisabled();
    });

    it("should have correct CSS classes", () => {
      render(<PhysicalInstanceDialog {...defaultCreateProps} />);

      const dialog = screen.getByTestId("dialog");
      expect(dialog).toHaveClass("ddi");
      expect(dialog).toHaveClass("physical-instance-creation-dialog");
    });
  });

  describe("Edit mode", () => {
    const defaultEditProps = {
      visible: true,
      onHide: mockOnHide,
      mode: "edit" as const,
      initialData: { label: "Existing Label" },
      onSubmitEdit: mockOnSubmitEdit,
    };

    it("should render the dialog in edit mode with correct title", () => {
      render(<PhysicalInstanceDialog {...defaultEditProps} />);

      expect(screen.getByText("Edit")).toBeInTheDocument();
    });

    it("should display initial label data", () => {
      render(<PhysicalInstanceDialog {...defaultEditProps} />);

      const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
      expect(labelInput.value).toBe("Existing Label");
    });

    it("should show save button in edit mode", () => {
      render(<PhysicalInstanceDialog {...defaultEditProps} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("should call onSubmitEdit when form is submitted in edit mode", async () => {
      mockOnSubmitEdit.mockResolvedValue(undefined);
      render(<PhysicalInstanceDialog {...defaultEditProps} />);

      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSubmitEdit).toHaveBeenCalledWith({
          label: "Existing Label",
          name: "DataRelationShip Name:Existing Label",
          group: { id: "group-1", agency: "agency-1" },
          studyUnit: { id: "study-1", agency: "agency-1" },
        });
      });
    });
  });

  describe("Form reset behavior", () => {
    it("should not reset form after successful creation (to avoid flash of empty form before redirect)", async () => {
      const mockOnSubmitCreate = vi.fn().mockResolvedValue(undefined);
      render(
        <PhysicalInstanceDialog
          visible={true}
          onHide={mockOnHide}
          mode="create"
          onSubmitCreate={mockOnSubmitCreate}
        />,
      );

      // Fill the form
      const labelInput = screen.getByLabelText("Label");
      fireEvent.change(labelInput, { target: { value: "Test Label" } });

      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      // Submit the form
      const createButton = screen.getByText("Create");
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockOnSubmitCreate).toHaveBeenCalled();
      });

      // After successful creation, the form should still have its values
      // (not reset) to avoid flash of empty form before redirect
      const labelInputAfter = screen.getByLabelText("Label") as HTMLInputElement;
      expect(labelInputAfter.value).toBe("Test Label");
    });

    it("should reset form after successful edit", async () => {
      const mockOnSubmitEdit = vi.fn().mockResolvedValue(undefined);
      render(
        <PhysicalInstanceDialog
          visible={true}
          onHide={mockOnHide}
          mode="edit"
          initialData={{ label: "Existing Label" }}
          onSubmitEdit={mockOnSubmitEdit}
        />,
      );

      // Modify the label
      const labelInput = screen.getByLabelText("Label");
      fireEvent.change(labelInput, { target: { value: "Modified Label" } });

      const groupDropdown = screen.getByTestId("dropdown-group");
      fireEvent.change(groupDropdown, { target: { value: "group-1" } });

      await waitFor(() => {
        const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
        expect(studyUnitDropdown).not.toBeDisabled();
      });

      const studyUnitDropdown = screen.getByTestId("dropdown-studyUnit");
      fireEvent.change(studyUnitDropdown, { target: { value: "study-1" } });

      // Submit the form
      const saveButton = screen.getByText("Save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnSubmitEdit).toHaveBeenCalled();
      });

      // After successful edit, the form should be reset
      const labelInputAfter = screen.getByLabelText("Label") as HTMLInputElement;
      expect(labelInputAfter.value).toBe("");
    });
  });
});
