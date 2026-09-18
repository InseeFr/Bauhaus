import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { mockDdiAccess } from "../../components/GlobalActionsCard/actions.testing";
import type { PhysicalInstanceUpdateData } from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// On monte le vrai <HasAccess> / useAuthorizationGuard ; seules les sources
// de privilèges et de stamps sont mockées.
vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

vi.mock("primereact/button", () => import("../../components/GlobalActionsCard/actions.testing"));

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

  const renderAndClickEdit = () => {
    render(<PhysicalInstanceLabel label="Test Label" onSave={mockOnSave} />);
    fireEvent.click(screen.getByLabelText("physicalInstance.view.editTitle"));
  };

  const openDialog = async () => {
    renderAndClickEdit();
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Par défaut : stratégie ALL → le bouton est rendu (non-régression).
    mockDdiAccess("UPDATE", "ALL");
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
    await openDialog();
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
    await openDialog();

    const closeButton = screen.getByTestId("close-dialog");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call onSave and close dialog when submit is clicked", async () => {
    await openDialog();

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
    renderAndClickEdit();

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
      mockDdiAccess("UPDATE", "STAMP", ["STAMP1"]);

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
      mockDdiAccess("UPDATE", "STAMP", ["STAMP9"]);

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
