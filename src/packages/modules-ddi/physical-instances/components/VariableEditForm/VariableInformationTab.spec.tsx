import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VariableInformationTab } from "./VariableInformationTab";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "physicalInstance.view.columns.name": "Nom",
        "physicalInstance.view.columns.label": "Label",
        "physicalInstance.view.columns.description": "Description",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("primereact/inputtext", () => ({
  InputText: ({ id, value, onChange, required }: any) => (
    <input id={id} value={value} onChange={onChange} required={required} />
  ),
}));

vi.mock("primereact/inputtextarea", () => ({
  InputTextarea: ({ id, value, onChange, rows }: any) => (
    <textarea id={id} value={value} onChange={onChange} rows={rows} />
  ),
}));

describe("VariableInformationTab", () => {
  const mockOnNameChange = vi.fn();
  const mockOnLabelChange = vi.fn();
  const mockOnDescriptionChange = vi.fn();

  const defaultProps = {
    name: "testVar",
    label: "Test Variable",
    description: "Test description",
    onNameChange: mockOnNameChange,
    onLabelChange: mockOnLabelChange,
    onDescriptionChange: mockOnDescriptionChange,
  };

  it("should render all fields with correct values", () => {
    render(<VariableInformationTab {...defaultProps} />);

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText("Description") as HTMLTextAreaElement;

    expect(nameInput.value).toBe("testVar");
    expect(labelInput.value).toBe("Test Variable");
    expect(descriptionInput.value).toBe("Test description");
  });

  it("should call onNameChange when name input changes", () => {
    render(<VariableInformationTab {...defaultProps} />);

    const nameInput = screen.getByLabelText("Nom");
    fireEvent.change(nameInput, { target: { value: "newName" } });

    expect(mockOnNameChange).toHaveBeenCalledWith("newName");
  });

  it("should call onLabelChange when label input changes", () => {
    render(<VariableInformationTab {...defaultProps} />);

    const labelInput = screen.getByLabelText("Label");
    fireEvent.change(labelInput, { target: { value: "New Label" } });

    expect(mockOnLabelChange).toHaveBeenCalledWith("New Label");
  });

  it("should call onDescriptionChange when description textarea changes", () => {
    render(<VariableInformationTab {...defaultProps} />);

    const descriptionInput = screen.getByLabelText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "New description" },
    });

    expect(mockOnDescriptionChange).toHaveBeenCalledWith("New description");
  });

  it("should mark name and label as required", () => {
    render(<VariableInformationTab {...defaultProps} />);

    const nameInput = screen.getByLabelText("Nom") as HTMLInputElement;
    const labelInput = screen.getByLabelText("Label") as HTMLInputElement;

    expect(nameInput).toHaveAttribute("required");
    expect(labelInput).toHaveAttribute("required");
  });
});
