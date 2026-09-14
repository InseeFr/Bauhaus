import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import type { PhysicalInstanceUpdateData } from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// On monte le vrai <HasAccess> / useAuthorizationGuard ; seules les sources
// de privilèges et de stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return { ...actual, usePrivileges: vi.fn(), useUserStamps: vi.fn() };
});

const ddiPrivileges = (strategy: string) => ({
  privileges: [
    {
      application: "DDI_PHYSICALINSTANCE",
      privileges: [{ privilege: "UPDATE", strategy }],
    },
  ],
});

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, icon, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {icon && <span className={icon} />}
      {label}
    </button>
  ),
}));

vi.mock("../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog", () => ({
  PhysicalInstanceDialog: ({ visible, onHide, onSubmitEdit, initialData }: any) =>
    visible ? (
      <div role="dialog" data-testid="physical-instance-dialog">
        <button onClick={onHide} data-testid="close-dialog">
          Close
        </button>
        <button
          onClick={() =>
            onSubmitEdit({
              label: "Updated Label",
              dataRelationshipLabel: "Updated DR",
              logicalRecordLabel: "Updated LR",
              group: { id: "group-1", agency: "agency-1" },
              studyUnit: { id: "study-1", agency: "agency-1" },
            } as PhysicalInstanceUpdateData)
          }
          data-testid="submit-dialog"
        >
          Submit
        </button>
        <span data-testid="initial-label">{initialData.label}</span>
      </div>
    ) : null,
}));

describe("PhysicalInstanceLabel", () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut : stratégie ALL → le bouton est rendu (non-régression).
    (usePrivileges as any).mockReturnValue(ddiPrivileges("ALL"));
    (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });
  });

  it("should render the label as h1", () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Label");
  });

  it("should render the edit button", () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    expect(editButton).toBeInTheDocument();
  });

  it("should open dialog when edit button is clicked", async () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("should have correct CSS classes", () => {
    const { container } = render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "align-items-center", "gap-2", "mb-3");
  });

  it("should render h1 with m-0 class", () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("m-0");
  });

  it("should render edit button with correct aria-label", () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute("aria-label", "physicalInstance.view.editTitle");
  });

  it("should close dialog when close button is clicked", async () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId("close-dialog");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call onSave and close dialog when submit is clicked", async () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId("submit-dialog");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        label: "Updated Label",
        dataRelationshipLabel: "Updated DR",
        logicalRecordLabel: "Updated LR",
        group: { id: "group-1", agency: "agency-1" },
        studyUnit: { id: "study-1", agency: "agency-1" },
      });
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should pass initial label to dialog", async () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);

    const editButton = screen.getByLabelText("physicalInstance.view.editTitle");
    fireEvent.click(editButton);

    await waitFor(() => {
      const initialLabel = screen.getByTestId("initial-label");
      expect(initialLabel).toHaveTextContent("Test Label");
    });
  });

  it("should handle empty label", () => {
    render(<PhysicalInstanceLabel label="" onSave={mockOnSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("");
  });

  it("should handle long label", () => {
    const longLabel = "A".repeat(200);
    render(<PhysicalInstanceLabel label={longLabel} onSave={mockOnSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(longLabel);
  });

  it("should handle special characters in label", () => {
    const specialLabel = "Test <Label> & 'Special' \"Characters\"";
    render(<PhysicalInstanceLabel label={specialLabel} onSave={mockOnSave} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(specialLabel);
  });

  describe("gating STAMP du bouton d'édition", () => {
    it("affiche le bouton quand un stamp utilisateur appartient à parents.stamps", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP1" }] });

      render(
        <PhysicalInstanceLabel
          label="Test Label"
          onSave={mockOnSave}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByLabelText("physicalInstance.view.editTitle")).toBeInTheDocument();
    });

    it("masque le bouton quand aucun stamp utilisateur n'appartient à parents.stamps", () => {
      (usePrivileges as any).mockReturnValue(ddiPrivileges("STAMP"));
      (useUserStamps as any).mockReturnValue({ data: [{ stamp: "STAMP9" }] });

      render(
        <PhysicalInstanceLabel
          label="Test Label"
          onSave={mockOnSave}
          stamps={["STAMP1", "STAMP2"]}
        />,
      );

      expect(screen.queryByLabelText("physicalInstance.view.editTitle")).not.toBeInTheDocument();
    });
  });
});
