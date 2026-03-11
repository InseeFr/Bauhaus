import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhysicalInstanceLabel } from "./PhysicalInstanceLabel";
import type { PhysicalInstanceUpdateData } from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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
});
