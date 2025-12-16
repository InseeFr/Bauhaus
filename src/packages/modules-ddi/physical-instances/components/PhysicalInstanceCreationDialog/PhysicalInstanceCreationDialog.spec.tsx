import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhysicalInstanceCreationDialog } from "./PhysicalInstanceCreationDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.creation.title": "Créer une nouvelle instance physique",
        "physicalInstance.creation.label": "Label",
        "physicalInstance.creation.name": "Name",
        "physicalInstance.creation.cancel": "Annuler",
        "physicalInstance.creation.create": "Créer",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, name, ...props }: any) => <input id={id} name={name} {...props} />,
}));

vi.mock("primereact/button", () => ({
  Button: ({ label, onClick, type = "button", className }: any) => (
    <button type={type} onClick={onClick} className={className}>
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
        <button type="button" onClick={onHide}>
          Close
        </button>
        {children}
      </div>
    );
  },
}));

describe("PhysicalInstanceCreationDialog", () => {
  const mockOnHide = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    visible: true,
    onHide: mockOnHide,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the dialog when visible is true", () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    expect(screen.getByText("Créer une nouvelle instance physique")).toBeInTheDocument();
    expect(screen.getByLabelText("Label")).toBeInTheDocument();
  });

  it("should not render the dialog when visible is false", () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} visible={false} />);

    expect(screen.queryByText("Créer une nouvelle instance physique")).not.toBeInTheDocument();
  });

  it("should call onHide when cancel button is clicked", () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const cancelButton = screen.getByText("Annuler");
    fireEvent.click(cancelButton);

    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it("should submit form data when create button is clicked", async () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const labelInput = screen.getByLabelText("Label");
    const createButton = screen.getByText("Créer");

    fireEvent.change(labelInput, { target: { value: "Test Label" } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        label: "Test Label",
        name: "DataRelationShip Name:Test Label",
      });
    });
  });

  it("should call onSubmit and form reset method after submission", async () => {
    const { container } = render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const form = container.querySelector("form") as HTMLFormElement;
    const resetSpy = vi.spyOn(form, "reset");

    fireEvent.change(labelInput, { target: { value: "Test Label" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        label: "Test Label",
        name: "DataRelationShip Name:Test Label",
      });
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  it("should call form reset method when dialog is hidden", async () => {
    const { container } = render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const cancelButton = screen.getByText("Annuler");
    const form = container.querySelector("form") as HTMLFormElement;
    const resetSpy = vi.spyOn(form, "reset");

    fireEvent.change(labelInput, { target: { value: "Test Label" } });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  it("should have correct button types", () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const cancelButton = screen.getByText("Annuler");
    const createButton = screen.getByText("Créer");

    expect(cancelButton).toHaveAttribute("type", "button");
    expect(createButton).toHaveAttribute("type", "submit");
  });

  it("should have correct CSS classes", () => {
    render(<PhysicalInstanceCreationDialog {...defaultProps} />);

    const createButton = screen.getByText("Créer");
    expect(createButton).toHaveClass("create-button");
  });
});
