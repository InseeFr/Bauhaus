import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { VariableInformationTab } from "./VariableInformationTab";

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.columns.name': 'Nom',
				'physicalInstance.view.columns.label': 'Label',
				'physicalInstance.view.columns.description': 'Description',
				'physicalInstance.view.validation.required': 'Ce champ est obligatoire',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtext', () => ({
	InputText: ({ id, value, onChange, required, className }: any) => (
		<input id={id} value={value} onChange={onChange} required={required} className={className} />
	),
}));

vi.mock('@components/rich-editor/react-md-editor', () => ({
	MDEditor: ({ text, handleChange }: any) => (
		<textarea
			id="variable-description"
			value={text}
			onChange={(e) => handleChange(e.target.value)}
			aria-label="Description"
		/>
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

		const nameInput = screen.getByLabelText(/Nom/) as HTMLInputElement;
		const labelInput = screen.getByLabelText(/Label/) as HTMLInputElement;
		const descriptionInput = screen.getByLabelText(
			'Description',
		) as HTMLTextAreaElement;

    expect(nameInput.value).toBe("testVar");
    expect(labelInput.value).toBe("Test Variable");
    expect(descriptionInput.value).toBe("Test description");
  });

  it("should call onNameChange when name input changes", () => {
    render(<VariableInformationTab {...defaultProps} />);

		const nameInput = screen.getByLabelText(/Nom/);
		fireEvent.change(nameInput, { target: { value: 'newName' } });

    expect(mockOnNameChange).toHaveBeenCalledWith("newName");
  });

  it("should call onLabelChange when label input changes", () => {
    render(<VariableInformationTab {...defaultProps} />);

		const labelInput = screen.getByLabelText(/Label/);
		fireEvent.change(labelInput, { target: { value: 'New Label' } });

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

		const nameInput = screen.getByLabelText(/Nom/) as HTMLInputElement;
		const labelInput = screen.getByLabelText(/Label/) as HTMLInputElement;

		expect(nameInput).toHaveAttribute('required');
		expect(labelInput).toHaveAttribute('required');
	});

	it('should display validation error for empty name', () => {
		const propsWithError = {
			...defaultProps,
			name: '',
			nameError: true,
		};
		render(<VariableInformationTab {...propsWithError} />);

		expect(screen.getByText('Ce champ est obligatoire')).toBeInTheDocument();
	});

	it('should display validation error for empty label', () => {
		const propsWithError = {
			...defaultProps,
			label: '',
			labelError: true,
		};
		render(<VariableInformationTab {...propsWithError} />);

		expect(screen.getByText('Ce champ est obligatoire')).toBeInTheDocument();
	});

	it('should add p-invalid class to name input when nameError is true', () => {
		const propsWithError = {
			...defaultProps,
			name: '',
			nameError: true,
		};
		render(<VariableInformationTab {...propsWithError} />);

		const nameInput = screen.getByLabelText(/Nom/);
		expect(nameInput).toHaveClass('p-invalid');
	});

	it('should add p-invalid class to label input when labelError is true', () => {
		const propsWithError = {
			...defaultProps,
			label: '',
			labelError: true,
		};
		render(<VariableInformationTab {...propsWithError} />);

		const labelInput = screen.getByLabelText(/Label/);
		expect(labelInput).toHaveClass('p-invalid');
	});

	it('should not display validation errors when no errors', () => {
		render(<VariableInformationTab {...defaultProps} />);

		expect(screen.queryByText('Ce champ est obligatoire')).not.toBeInTheDocument();
	});
});
