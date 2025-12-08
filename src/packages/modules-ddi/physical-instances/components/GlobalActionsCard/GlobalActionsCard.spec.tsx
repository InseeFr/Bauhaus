import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GlobalActionsCard } from './GlobalActionsCard';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.globalActions': 'Actions Globales',
				'physicalInstance.view.export': 'Exporter',
				'physicalInstance.view.publish': 'Publier',
				'physicalInstance.view.variablesTable': 'Tableau des variables',
				'physicalInstance.view.columns.name': 'Nom',
				'physicalInstance.view.columns.label': 'Label',
				'physicalInstance.view.columns.type': 'Type',
				'physicalInstance.view.columns.lastModified': 'Dernière Modification',
				'physicalInstance.view.delete': 'Supprimer',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/button', () => ({
	Button: ({ label, onClick, icon, ...props }: any) => (
		<button type="button" onClick={onClick} {...props}>
			{icon && <span className={icon} />}
			{label}
		</button>
	),
}));

vi.mock('primereact/splitbutton', () => ({
	SplitButton: ({ label, onClick, model, icon, ...props }: any) => (
		<div data-testid="split-button" {...props}>
			<button type="button" onClick={onClick} aria-label={props['aria-label']}>
				{icon && <span className={icon} />}
				{label}
			</button>
			{model && (
				<div data-testid="split-button-menu">
					{model.map((item: any, index: number) => (
						<button
							key={index}
							type="button"
							onClick={item.command}
							data-testid={`menu-item-${item.label}`}
						>
							{item.icon && <span className={item.icon} />}
							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	),
}));

vi.mock('primereact/card', () => ({
	Card: ({ title, children }: any) => (
		<div data-testid="card">
			<h3>{title}</h3>
			{children}
		</div>
	),
}));

vi.mock('primereact/datatable', () => ({
	DataTable: ({ value, children, onRowClick, ...props }: any) => {
		// Convert children to array to handle both single and multiple Column components
		const columns = Array.isArray(children) ? children : [children];

		return (
			<table {...props}>
				<thead>
					<tr>
						{columns.map((col: any, idx: number) => (
							<th key={idx}>{col.props.header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{value.map((item: any, index: number) => (
						<tr
							key={index}
							onClick={() => onRowClick?.({ data: item })}
						>
							{columns.map((col: any, colIdx: number) => (
								<td key={colIdx}>
									{col.props.body ? col.props.body(item) : item[col.props.field]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	},
}));

vi.mock('primereact/column', () => ({
	Column: ({ header, field, body }: any) => null,
}));

describe('GlobalActionsCard', () => {
	const mockOnExport = vi.fn();
	const mockOnRowClick = vi.fn();
	const mockOnDeleteClick = vi.fn();

	const mockVariables = [
		{
			id: '1',
			name: 'Variable1',
			label: 'Label 1',
			type: 'Code',
			lastModified: '2024-01-01',
		},
		{
			id: '2',
			name: 'Variable2',
			label: 'Label 2',
			type: 'Numeric',
			lastModified: '2024-01-02',
		},
	];

	const defaultProps = {
		variables: mockVariables,
		onExport: mockOnExport,
		onRowClick: mockOnRowClick,
		onDeleteClick: mockOnDeleteClick,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render card with title', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		expect(screen.getByText('Actions Globales')).toBeInTheDocument();
	});

	it('should render all action buttons', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		expect(screen.getByText('Exporter')).toBeInTheDocument();
		expect(screen.getByText('Publier')).toBeInTheDocument();
	});

	it('should call onExport with DDI3 when export button is clicked', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		const exportButton = screen.getByText('Exporter');
		fireEvent.click(exportButton);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith('DDI3');
	});

	it('should render export menu with DDI3 and DDI4 options', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		expect(screen.getByTestId('menu-item-DDI 3.3')).toBeInTheDocument();
		expect(screen.getByTestId('menu-item-DDI 3.0/JSON')).toBeInTheDocument();
	});

	it('should call onExport with DDI3 when DDI3 menu item is clicked', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		const ddi3MenuItem = screen.getByTestId('menu-item-DDI 3.3');
		fireEvent.click(ddi3MenuItem);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith('DDI3');
	});

	it('should call onExport with DDI4 when DDI4 menu item is clicked', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		const ddi4MenuItem = screen.getByTestId('menu-item-DDI 3.0/JSON');
		fireEvent.click(ddi4MenuItem);

		expect(mockOnExport).toHaveBeenCalledTimes(1);
		expect(mockOnExport).toHaveBeenCalledWith('DDI4');
	});

	it('should render data table with correct columns', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		expect(screen.getByText('Nom')).toBeInTheDocument();
		expect(screen.getByText('Label')).toBeInTheDocument();
		expect(screen.getByText('Type')).toBeInTheDocument();
		expect(screen.getByText('Dernière Modification')).toBeInTheDocument();
	});

	it('should render all variables in the table', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		expect(screen.getByText('Variable1')).toBeInTheDocument();
		expect(screen.getByText('Label 1')).toBeInTheDocument();
		expect(screen.getByText('Code')).toBeInTheDocument();
		expect(screen.getByText('Variable2')).toBeInTheDocument();
		expect(screen.getByText('Label 2')).toBeInTheDocument();
		expect(screen.getByText('Numeric')).toBeInTheDocument();
	});

	it('should render empty table when no variables', () => {
		render(<GlobalActionsCard {...defaultProps} variables={[]} />);

		const table = screen.getByLabelText('Tableau des variables');
		expect(table).toBeInTheDocument();
	});

	it('should have correct aria-labels for accessibility', () => {
		render(<GlobalActionsCard {...defaultProps} />);

		// SplitButton creates multiple elements with the same aria-label
		const exportElements = screen.getAllByLabelText('Exporter');
		expect(exportElements.length).toBeGreaterThan(0);
		expect(screen.getByLabelText('Publier')).toBeInTheDocument();
		expect(screen.getByLabelText('Tableau des variables')).toBeInTheDocument();
	});

	describe('Delete functionality', () => {
		it('should render delete buttons for each variable', () => {
			render(<GlobalActionsCard {...defaultProps} />);

			const deleteButtons = screen.getAllByLabelText('Supprimer');
			expect(deleteButtons).toHaveLength(mockVariables.length);
		});

		it('should call onDeleteClick with variable data when delete button is clicked', () => {
			render(<GlobalActionsCard {...defaultProps} />);

			const deleteButtons = screen.getAllByLabelText('Supprimer');
			fireEvent.click(deleteButtons[0]);

			expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
			expect(mockOnDeleteClick).toHaveBeenCalledWith(mockVariables[0]);
		});

		it('should not call onRowClick when delete button is clicked', () => {
			render(<GlobalActionsCard {...defaultProps} />);

			const deleteButtons = screen.getAllByLabelText('Supprimer');
			fireEvent.click(deleteButtons[0]);

			expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
			expect(mockOnRowClick).not.toHaveBeenCalled();
		});
	});

	describe('Optional callbacks', () => {
		it('should render without onRowClick callback', () => {
			const propsWithoutRowClick = {
				variables: mockVariables,
				onExport: mockOnExport,
			};

			expect(() => render(<GlobalActionsCard {...propsWithoutRowClick} />)).not.toThrow();
		});

		it('should render without onDeleteClick callback', () => {
			const propsWithoutDeleteClick = {
				variables: mockVariables,
				onExport: mockOnExport,
				onRowClick: mockOnRowClick,
			};

			expect(() => render(<GlobalActionsCard {...propsWithoutDeleteClick} />)).not.toThrow();
		});
	});
});
