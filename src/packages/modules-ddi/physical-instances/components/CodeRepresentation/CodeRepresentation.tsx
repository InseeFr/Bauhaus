import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';
import type {
	CodeRepresentation as CodeRepresentationType,
	CodeList,
	Code,
	Category,
} from '../../types/api';

interface CodeRepresentationProps {
	representation?: CodeRepresentationType;
	codeList?: CodeList;
	categories?: Category[];
	onChange: (
		representation: CodeRepresentationType | undefined,
		codeList?: CodeList,
		categories?: Category[],
	) => void;
}

interface CodeTableRow {
	id: string;
	value: string;
	label: string;
	categoryId: string;
	isNew?: boolean;
}

export const CodeRepresentation = ({
	representation,
	codeList,
	categories = [],
	onChange,
}: Readonly<CodeRepresentationProps>) => {
	const { t } = useTranslation();
	const [codeListLabel, setCodeListLabel] = useState(
		codeList?.Label?.Content?.['#text'] || '',
	);
	const [codes, setCodes] = useState<CodeTableRow[]>([]);

	useEffect(() => {
		setCodeListLabel(codeList?.Label?.Content?.['#text'] || '');

		if (codeList?.Code && categories) {
			const tableData: CodeTableRow[] = codeList.Code.map((code) => {
				const category = categories.find(
					(cat) => cat.ID === code.CategoryReference.ID,
				);
				return {
					id: code.ID,
					value: code.Value,
					label: category?.Label?.Content?.['#text'] || '',
					categoryId: category?.ID || '',
				};
			});
			setCodes(tableData);
		} else {
			setCodes([]);
		}
	}, [codeList, categories]);

	const handleCodeListLabelChange = (newLabel: string) => {
		setCodeListLabel(newLabel);

		if (!representation) return;

		const updatedCodeList: CodeList = {
			...(codeList || {
				'@isUniversallyUnique': 'true',
				'@versionDate': new Date().toISOString(),
				URN: `urn:ddi:fr.insee:${crypto.randomUUID()}:1`,
				Agency: 'fr.insee',
				ID: crypto.randomUUID(),
				Version: '1',
				Code: [],
			}),
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': newLabel,
				},
			},
		};

		onChange(representation, updatedCodeList, categories);
	};

	const handleDeleteCode = (codeId: string) => {
		const updatedCodes = codes.filter((code) => code.id !== codeId);
		setCodes(updatedCodes);

		if (!representation) return;

		const deletedCode = codes.find((c) => c.id === codeId);
		const updatedCodeList: CodeList = {
			...(codeList || {
				'@isUniversallyUnique': 'true',
				'@versionDate': new Date().toISOString(),
				URN: `urn:ddi:fr.insee:${crypto.randomUUID()}:1`,
				Agency: 'fr.insee',
				ID: crypto.randomUUID(),
				Version: '1',
				Label: {
					Content: {
						'@xml:lang': 'fr-FR',
						'#text': codeListLabel,
					},
				},
				Code: [],
			}),
			Code: codeList?.Code?.filter((code) => code.ID !== codeId),
		};

		const updatedCategories = deletedCode
			? categories.filter((cat) => cat.ID !== deletedCode.categoryId)
			: categories;

		onChange(representation, updatedCodeList, updatedCategories);
	};

	const handleCellEdit = (
		rowData: CodeTableRow,
		field: 'value' | 'label',
		newValue: string,
	) => {
		const updatedCodes = codes.map((code) =>
			code.id === rowData.id ? { ...code, [field]: newValue } : code,
		);
		setCodes(updatedCodes);

		if (!representation) return;

		const updatedCode = updatedCodes.find((c) => c.id === rowData.id);
		if (!updatedCode) return;

		const newCategory: Category = {
			'@isUniversallyUnique': 'true',
			'@versionDate': new Date().toISOString(),
			URN: `urn:ddi:fr.insee:${updatedCode.categoryId}:1`,
			Agency: 'fr.insee',
			ID: updatedCode.categoryId,
			Version: '1',
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': updatedCode.label,
				},
			},
		};

		const newCode: Code = {
			'@isUniversallyUnique': 'true',
			URN: `urn:ddi:fr.insee:${updatedCode.id}:1`,
			Agency: 'fr.insee',
			ID: updatedCode.id,
			Version: '1',
			CategoryReference: {
				Agency: 'fr.insee',
				ID: updatedCode.categoryId,
				Version: '1',
				TypeOfObject: 'Category',
			},
			Value: updatedCode.value,
		};

		const existingCode = codeList?.Code?.find((c) => c.ID === rowData.id);
		let updatedCodeListCodes: Code[];
		let updatedCategories: Category[];

		if (existingCode) {
			// Modification d'un code existant
			updatedCodeListCodes =
				codeList?.Code?.map((code) =>
					code.ID === rowData.id ? newCode : code,
				) || [];
			updatedCategories = categories.map((cat) =>
				cat.ID === rowData.categoryId ? newCategory : cat,
			);
		} else {
			// Ajout d'un nouveau code
			updatedCodeListCodes = [...(codeList?.Code || []), newCode];
			updatedCategories = [...categories, newCategory];
		}

		const updatedCodeList: CodeList = {
			...(codeList || {
				'@isUniversallyUnique': 'true',
				'@versionDate': new Date().toISOString(),
				URN: `urn:ddi:fr.insee:${crypto.randomUUID()}:1`,
				Agency: 'fr.insee',
				ID: crypto.randomUUID(),
				Version: '1',
				Label: {
					Content: {
						'@xml:lang': 'fr-FR',
						'#text': codeListLabel,
					},
				},
			}),
			Code: updatedCodeListCodes,
		};

		onChange(representation, updatedCodeList, updatedCategories);
	};

	const valueEditor = (rowData: CodeTableRow) => {
		return (
			<InputText
				type="text"
				value={rowData.value}
				onChange={(e) => handleCellEdit(rowData, 'value', e.target.value)}
				className="w-full"
			/>
		);
	};

	const labelEditor = (rowData: CodeTableRow) => {
		return (
			<InputText
				type="text"
				value={rowData.label}
				onChange={(e) => handleCellEdit(rowData, 'label', e.target.value)}
				className="w-full"
			/>
		);
	};

	const actionBodyTemplate = (rowData: CodeTableRow) => {
		return (
			<div className="flex gap-2">
				<Button
					icon="pi pi-trash"
					rounded
					text
					severity="danger"
					onClick={() => handleDeleteCode(rowData.id)}
				/>
			</div>
		);
	};

	const [emptyRowValue, setEmptyRowValue] = useState('');
	const [emptyRowLabel, setEmptyRowLabel] = useState('');

	const emptyRow: CodeTableRow = {
		id: '',
		value: emptyRowValue,
		label: emptyRowLabel,
		categoryId: '',
	};

	const handleAddCodeFromEmpty = () => {
		if (!emptyRowValue && !emptyRowLabel) return;

		const newRow: CodeTableRow = {
			id: crypto.randomUUID(),
			value: emptyRowValue,
			label: emptyRowLabel,
			categoryId: crypto.randomUUID(),
			isNew: true,
		};

		const updatedCodes = [...codes, newRow];
		setCodes(updatedCodes);
		setEmptyRowValue('');
		setEmptyRowLabel('');

		// Créer une représentation par défaut si elle n'existe pas
		const currentRepresentation: CodeRepresentationType = representation || {
			'@blankIsMissingValue': 'false',
			CodeListReference: {
				Agency: 'fr.insee',
				ID: crypto.randomUUID(),
				Version: '1',
				TypeOfObject: 'CodeList',
			},
		};

		const newCategory: Category = {
			'@isUniversallyUnique': 'true',
			'@versionDate': new Date().toISOString(),
			URN: `urn:ddi:fr.insee:${newRow.categoryId}:1`,
			Agency: 'fr.insee',
			ID: newRow.categoryId,
			Version: '1',
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': newRow.label,
				},
			},
		};

		const newCode: Code = {
			'@isUniversallyUnique': 'true',
			URN: `urn:ddi:fr.insee:${newRow.id}:1`,
			Agency: 'fr.insee',
			ID: newRow.id,
			Version: '1',
			CategoryReference: {
				Agency: 'fr.insee',
				ID: newRow.categoryId,
				Version: '1',
				TypeOfObject: 'Category',
			},
			Value: newRow.value,
		};

		const updatedCodeList: CodeList = {
			...(codeList || {
				'@isUniversallyUnique': 'true',
				'@versionDate': new Date().toISOString(),
				URN: `urn:ddi:fr.insee:${crypto.randomUUID()}:1`,
				Agency: 'fr.insee',
				ID: crypto.randomUUID(),
				Version: '1',
				Label: {
					Content: {
						'@xml:lang': 'fr-FR',
						'#text': codeListLabel,
					},
				},
			}),
			Code: [...(codeList?.Code || []), newCode],
		};

		onChange(currentRepresentation, updatedCodeList, [
			...categories,
			newCategory,
		]);
	};

	const emptyRowValueTemplate = () => {
		return (
			<InputText
				type="text"
				value={emptyRowValue}
				onChange={(e) => setEmptyRowValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddCodeFromEmpty();
					}
				}}
				placeholder={t('physicalInstance.view.code.value')}
				className="w-full"
			/>
		);
	};

	const emptyRowLabelTemplate = () => {
		return (
			<InputText
				type="text"
				value={emptyRowLabel}
				onChange={(e) => setEmptyRowLabel(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleAddCodeFromEmpty();
					}
				}}
				placeholder={t('physicalInstance.view.code.label')}
				className="w-full"
			/>
		);
	};

	const emptyRowActionTemplate = () => {
		const hasContent = emptyRowValue || emptyRowLabel;
		return (
			<>
				<Button
					icon="pi pi-plus"
					rounded
					text
					onClick={handleAddCodeFromEmpty}
					disabled={!hasContent}
					className="add-code-button"
					tooltip={
						hasContent
							? t('physicalInstance.view.code.addCodeTooltip')
							: t('physicalInstance.view.code.fillFieldsTooltip')
					}
					tooltipOptions={{ position: 'left' }}
				/>
			</>
		);
	};

	return (
		<>
			<div className="flex flex-column gap-2">
				<label htmlFor="code-list-label">
					{t('physicalInstance.view.code.codeListLabel')}
				</label>
				<InputText
					id="code-list-label"
					name="codeListLabel"
					value={codeListLabel}
					onChange={(e) => handleCodeListLabelChange(e.target.value)}
				/>
			</div>

			<div className="flex flex-column gap-2">
				<div className="flex gap-2">
					<Button
						icon="pi pi-plus"
						label={t('physicalInstance.view.code.createNewList')}
						outlined
						onClick={() => {}}
					/>
					<Button
						icon="pi pi-sync"
						label={t('physicalInstance.view.code.reuseList')}
						outlined
						onClick={() => {}}
					/>
					<Button
						icon="pi pi-upload"
						label={t('physicalInstance.view.code.importList')}
						outlined
						onClick={() => {}}
					/>
				</div>
				<DataTable value={[...codes, emptyRow]} size="small">
					<Column
						field="value"
						header={t('physicalInstance.view.code.value')}
						body={(rowData) =>
							rowData.id === '' ? emptyRowValueTemplate() : valueEditor(rowData)
						}
					/>
					<Column
						field="label"
						header={t('physicalInstance.view.code.label')}
						body={(rowData) =>
							rowData.id === '' ? emptyRowLabelTemplate() : labelEditor(rowData)
						}
					/>
					<Column
						body={(rowData) =>
							rowData.id === ''
								? emptyRowActionTemplate()
								: actionBodyTemplate(rowData)
						}
						style={{ width: '5rem' }}
					/>
				</DataTable>
			</div>
		</>
	);
};
