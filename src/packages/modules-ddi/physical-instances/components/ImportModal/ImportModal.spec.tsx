import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImportModal } from './ImportModal';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.importModal.title': 'Importer',
				'physicalInstance.view.importModal.placeholder':
					'Collez vos données ici...',
				'physicalInstance.view.importModal.cancel': 'Annuler',
				'physicalInstance.view.importModal.import': 'Importer',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtextarea', () => ({
	InputTextarea: ({ value, onChange, placeholder, rows, className }: any) => (
		<textarea
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			rows={rows}
			className={className}
		/>
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

describe('ImportModal', () => {
	const mockOnHide = vi.fn();
	const mockOnImportDataChange = vi.fn();
	const mockOnImport = vi.fn();

	const defaultProps = {
		visible: true,
		onHide: mockOnHide,
		importData: '',
		onImportDataChange: mockOnImportDataChange,
		onImport: mockOnImport,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the dialog when visible is true', () => {
		render(<ImportModal {...defaultProps} />);

		expect(
			screen.getByRole('heading', { name: 'Importer' }),
		).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText('Collez vos données ici...'),
		).toBeInTheDocument();
	});

	it('should not render the dialog when visible is false', () => {
		render(<ImportModal {...defaultProps} visible={false} />);

		expect(screen.queryByText('Importer')).not.toBeInTheDocument();
	});

	it('should display import data in textarea', () => {
		const importData = 'Test import data';
		render(<ImportModal {...defaultProps} importData={importData} />);

		const textarea = screen.getByPlaceholderText(
			'Collez vos données ici...',
		) as HTMLTextAreaElement;
		expect(textarea.value).toBe(importData);
	});

	it('should call onImportDataChange when textarea changes', () => {
		render(<ImportModal {...defaultProps} />);

		const textarea = screen.getByPlaceholderText('Collez vos données ici...');
		fireEvent.change(textarea, { target: { value: 'New import data' } });

		expect(mockOnImportDataChange).toHaveBeenCalledWith('New import data');
	});

	it('should call onHide when cancel button is clicked', () => {
		render(<ImportModal {...defaultProps} />);

		const cancelButton = screen.getByText('Annuler');
		fireEvent.click(cancelButton);

		expect(mockOnHide).toHaveBeenCalledTimes(1);
	});

	it('should call onImport when import button is clicked', () => {
		render(<ImportModal {...defaultProps} />);

		const importButton = screen.getByRole('button', { name: 'Importer' });
		fireEvent.click(importButton);

		expect(mockOnImport).toHaveBeenCalledTimes(1);
	});

	it('should have correct CSS classes', () => {
		render(<ImportModal {...defaultProps} />);

		const dialog = screen.getByTestId('dialog');
		expect(dialog).toHaveClass('ddi');
		expect(dialog).toHaveClass('physical-import-dialog');
	});

	it('should have textarea with 10 rows', () => {
		render(<ImportModal {...defaultProps} />);

		const textarea = screen.getByPlaceholderText('Collez vos données ici...');
		expect(textarea).toHaveAttribute('rows', '10');
	});
});
