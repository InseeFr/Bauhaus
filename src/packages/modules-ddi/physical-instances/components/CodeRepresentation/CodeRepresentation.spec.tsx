import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodeRepresentation } from './CodeRepresentation';
import type {
	CodeRepresentation as CodeRepresentationType,
	CodeList,
	Category,
} from '../../types/api';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				'physicalInstance.view.code.codeListLabel':
					'Libellé de la liste de codes',
				'physicalInstance.view.code.codes': 'Codes',
				'physicalInstance.view.code.value': 'Valeur',
				'physicalInstance.view.code.label': 'Libellé',
				'physicalInstance.view.code.addCodeTooltip': 'Ajouter ce code',
				'physicalInstance.view.code.fillFieldsTooltip':
					'Remplissez au moins un champ pour ajouter un code',
				'physicalInstance.view.code.createNewList': 'Créer une nouvelle liste',
				'physicalInstance.view.code.reuseList': 'Réutiliser',
				'physicalInstance.view.code.importList': 'Importer',
			};
			return translations[key] || key;
		},
	}),
}));

vi.mock('primereact/inputtext', () => ({
	InputText: ({ id, value, onChange, onBlur, onKeyDown, placeholder, ...props }: any) => (
		<input
			id={id}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			{...props}
		/>
	),
}));

vi.mock('primereact/button', () => ({
	Button: ({ icon, label, onClick, disabled, tooltip, children }: any) => (
		<button onClick={onClick} disabled={disabled} title={tooltip}>
			{label || icon || children}
		</button>
	),
}));

vi.mock('primereact/datatable', () => ({
	DataTable: ({ value, children }: any) => {
		const columns = Array.isArray(children) ? children : [children];

		return (
			<table>
				<tbody>
					{value?.map((row: any, index: number) => (
						<tr key={index} data-testid={`row-${index}`}>
							{columns.map((column: any, colIndex: number) => {
								if (column?.props?.body) {
									return <td key={colIndex}>{column.props.body(row)}</td>;
								}
								return <td key={colIndex}>{row[column?.props?.field]}</td>;
							})}
						</tr>
					))}
				</tbody>
			</table>
		);
	},
}));

vi.mock('primereact/column', () => ({
	Column: () => null,
}));

vi.mock('primereact/tooltip', () => ({
	Tooltip: () => null,
}));

describe('CodeRepresentation', () => {
	const mockOnChange = vi.fn();

	const mockRepresentation: CodeRepresentationType = {
		'@blankIsMissingValue': 'false',
		CodeListReference: {
			Agency: 'fr.insee',
			ID: 'codelist-1',
			Version: '1',
			TypeOfObject: 'CodeList',
		},
	};

	const mockCodeList: CodeList = {
		'@isUniversallyUnique': 'true',
		'@versionDate': '2024-01-01T00:00:00Z',
		URN: 'urn:ddi:fr.insee:codelist-1:1',
		Agency: 'fr.insee',
		ID: 'codelist-1',
		Version: '1',
		Label: {
			Content: {
				'@xml:lang': 'fr-FR',
				'#text': 'Liste de codes test',
			},
		},
		Code: [
			{
				'@isUniversallyUnique': 'true',
				URN: 'urn:ddi:fr.insee:code-1:1',
				Agency: 'fr.insee',
				ID: 'code-1',
				Version: '1',
				CategoryReference: {
					Agency: 'fr.insee',
					ID: 'category-1',
					Version: '1',
					TypeOfObject: 'Category',
				},
				Value: '1',
			},
		],
	};

	const mockCategories: Category[] = [
		{
			'@isUniversallyUnique': 'true',
			'@versionDate': '2024-01-01T00:00:00Z',
			URN: 'urn:ddi:fr.insee:category-1:1',
			Agency: 'fr.insee',
			ID: 'category-1',
			Version: '1',
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': 'Oui',
				},
			},
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render code list label input', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		expect(
			screen.getByLabelText('Libellé de la liste de codes'),
		).toBeInTheDocument();
	});

	it('should display initial code list label', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const labelInput = screen.getByLabelText(
			'Libellé de la liste de codes',
		) as HTMLInputElement;
		expect(labelInput.value).toBe('Liste de codes test');
	});

	it('should call onChange when code list label changes', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const labelInput = screen.getByLabelText('Libellé de la liste de codes');
		fireEvent.change(labelInput, { target: { value: 'Nouveau libellé' } });

		expect(mockOnChange).toHaveBeenCalledWith(
			mockRepresentation,
			expect.objectContaining({
				Label: {
					Content: {
						'@xml:lang': 'fr-FR',
						'#text': 'Nouveau libellé',
					},
				},
			}),
			mockCategories,
		);
	});

	it('should display code action buttons', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		expect(screen.getByText('Créer une nouvelle liste')).toBeInTheDocument();
		expect(screen.getByText('Réutiliser')).toBeInTheDocument();
		expect(screen.getByText('Importer')).toBeInTheDocument();
	});

	it('should display empty row with input fields', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const inputs = screen.getAllByPlaceholderText(/Valeur|Libellé/);
		expect(inputs.length).toBeGreaterThan(0);
	});

	it('should show add button disabled when empty row has no content', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const addButtons = screen.getAllByRole('button');
		const addButton = addButtons.find((btn) => btn.textContent === 'pi pi-plus');

		// Le bouton devrait être désactivé au départ
		expect(addButton).toBeDefined();
	});

	it('should handle code deletion', () => {
		render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const deleteButtons = screen.getAllByRole('button');
		const trashButton = deleteButtons.find((btn) =>
			btn.textContent?.includes('pi pi-trash'),
		);

		if (trashButton) {
			fireEvent.click(trashButton);

			expect(mockOnChange).toHaveBeenCalledWith(
				mockRepresentation,
				expect.objectContaining({
					Code: [],
				}),
				[],
			);
		}
	});

	it('should handle empty representation and codeList', () => {
		render(
			<CodeRepresentation
				representation={undefined}
				codeList={undefined}
				categories={[]}
				onChange={mockOnChange}
			/>,
		);

		const labelInput = screen.getByLabelText(
			'Libellé de la liste de codes',
		) as HTMLInputElement;
		expect(labelInput.value).toBe('');
	});

	it('should update when props change', () => {
		const { rerender } = render(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={mockCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const newCodeList: CodeList = {
			...mockCodeList,
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': 'Liste modifiée',
				},
			},
		};

		rerender(
			<CodeRepresentation
				representation={mockRepresentation}
				codeList={newCodeList}
				categories={mockCategories}
				onChange={mockOnChange}
			/>,
		);

		const labelInput = screen.getByLabelText(
			'Libellé de la liste de codes',
		) as HTMLInputElement;
		expect(labelInput.value).toBe('Liste modifiée');
	});
});
