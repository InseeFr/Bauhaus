import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditModal } from './EditModal';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.editModal.title': 'Modifier',
				'physicalInstance.view.editModal.label': 'Label',
				'physicalInstance.view.editModal.name': 'Name',
				'physicalInstance.view.editModal.cancel': 'Annuler',
				'physicalInstance.view.editModal.save': 'Enregistrer',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtext', () => ({
	InputText: ({ id, value, onChange, ...props }: any) => (
		<input id={id} value={value} onChange={onChange} {...props} />
	),
}));

vi.mock('primereact/button', () => ({
	Button: ({ label, onClick, type = 'button', className }: any) => (
		<button type={type} onClick={onClick} className={className}>
			{label}
		</button>
	),
}));

vi.mock('primereact/dialog', () => ({
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

describe('EditModal', () => {
	const mockOnHide = vi.fn();
	const mockOnFormDataChange = vi.fn();
	const mockOnSave = vi.fn();

	const defaultProps = {
		visible: true,
		onHide: mockOnHide,
		formData: { label: 'Test Label', name: 'Test Name' },
		onFormDataChange: mockOnFormDataChange,
		onSave: mockOnSave,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the dialog when visible is true', () => {
		render(<EditModal {...defaultProps} />);

		expect(screen.getByText('Modifier')).toBeInTheDocument();
		expect(screen.getByLabelText('Label')).toBeInTheDocument();
	});

	it('should not render the dialog when visible is false', () => {
		render(<EditModal {...defaultProps} visible={false} />);

		expect(screen.queryByText('Modifier')).not.toBeInTheDocument();
	});

	it('should display current form data', () => {
		render(<EditModal {...defaultProps} />);

		const labelInput = screen.getByLabelText('Label') as HTMLInputElement;

		expect(labelInput.value).toBe('Test Label');
	});

	it('should call onFormDataChange when label input changes', () => {
		render(<EditModal {...defaultProps} />);

		const labelInput = screen.getByLabelText('Label');
		fireEvent.change(labelInput, { target: { value: 'New Label' } });

		expect(mockOnFormDataChange).toHaveBeenCalledWith({
			name: 'Test Name',
			label: 'New Label',
		});
	});


	it('should call onHide when cancel button is clicked', () => {
		render(<EditModal {...defaultProps} />);

		const cancelButton = screen.getByText('Annuler');
		fireEvent.click(cancelButton);

		expect(mockOnHide).toHaveBeenCalledTimes(1);
	});

	it('should call onSave when save button is clicked', () => {
		render(<EditModal {...defaultProps} />);

		const saveButton = screen.getByText('Enregistrer');
		fireEvent.click(saveButton);

		expect(mockOnSave).toHaveBeenCalledTimes(1);
	});

	it('should have correct CSS classes', () => {
		render(<EditModal {...defaultProps} />);

		const dialog = screen.getByTestId('dialog');
		expect(dialog).toHaveClass('ddi');
		expect(dialog).toHaveClass('physical-instance-update-dialog');
	});
});
