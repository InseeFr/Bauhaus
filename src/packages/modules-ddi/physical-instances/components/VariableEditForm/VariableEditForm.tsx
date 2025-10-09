import { useCallback, useReducer, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { TabView, TabPanel } from 'primereact/tabview';
import { useTranslation } from 'react-i18next';
import type {
	NumericRepresentation,
	DateTimeRepresentation,
	TextRepresentation,
	CodeRepresentation,
	CodeList,
	Category,
} from '../../types/api';
import { NumericRepresentation as NumericRepresentationComponent } from '../NumericRepresentation/NumericRepresentation';
import { DateRepresentation } from '../DateRepresentation/DateRepresentation';
import { TextRepresentation as TextRepresentationComponent } from '../TextRepresentation/TextRepresentation';
import { CodeRepresentation as CodeRepresentationComponent } from '../CodeRepresentation/CodeRepresentation';

interface VariableRepresentationState {
	NumericRepresentation?: NumericRepresentation;
	DateTimeRepresentation?: DateTimeRepresentation;
	TextRepresentation?: TextRepresentation;
	CodeRepresentation?: CodeRepresentation;
	CodeList?: CodeList;
	Category?: Category[];
}

interface FormState {
	label: string;
	name: string;
	description: string;
	selectedType: string;
	isGeographic: boolean;
	representation: VariableRepresentationState;
}

type FormAction =
	| { type: 'SET_LABEL'; payload: string }
	| { type: 'SET_NAME'; payload: string }
	| { type: 'SET_DESCRIPTION'; payload: string }
	| { type: 'SET_TYPE'; payload: string }
	| { type: 'SET_IS_GEOGRAPHIC'; payload: boolean }
	| {
			type: 'SET_NUMERIC_REPRESENTATION';
			payload: NumericRepresentation | undefined;
	  }
	| {
			type: 'SET_DATE_REPRESENTATION';
			payload: DateTimeRepresentation | undefined;
	  }
	| { type: 'SET_TEXT_REPRESENTATION'; payload: TextRepresentation | undefined }
	| {
			type: 'SET_CODE_REPRESENTATION';
			payload: {
				codeRep: CodeRepresentation | undefined;
				codeList?: CodeList;
				categories?: Category[];
			};
	  }
	| { type: 'RESET'; payload: FormState };

function formReducer(state: FormState, action: FormAction): FormState {
	switch (action.type) {
		case 'SET_LABEL':
			return { ...state, label: action.payload };
		case 'SET_NAME':
			return { ...state, name: action.payload };
		case 'SET_DESCRIPTION':
			return { ...state, description: action.payload };
		case 'SET_TYPE':
			return { ...state, selectedType: action.payload };
		case 'SET_IS_GEOGRAPHIC':
			return { ...state, isGeographic: action.payload };
		case 'SET_NUMERIC_REPRESENTATION':
			return {
				...state,
				representation: {
					...state.representation,
					NumericRepresentation: action.payload,
				},
			};
		case 'SET_DATE_REPRESENTATION':
			return {
				...state,
				representation: {
					...state.representation,
					DateTimeRepresentation: action.payload,
				},
			};
		case 'SET_TEXT_REPRESENTATION':
			return {
				...state,
				representation: {
					...state.representation,
					TextRepresentation: action.payload,
				},
			};
		case 'SET_CODE_REPRESENTATION':
			return {
				...state,
				representation: {
					...state.representation,
					CodeRepresentation: action.payload.codeRep,
					CodeList: action.payload.codeList,
					Category: action.payload.categories,
				},
			};
		case 'RESET':
			return action.payload;
		default:
			return state;
	}
}

interface VariableEditFormProps {
	variable: {
		id: string;
		label: string;
		name: string;
		description?: string;
		type: string;
		isGeographic?: boolean;
		numericRepresentation?: NumericRepresentation;
		dateRepresentation?: DateTimeRepresentation;
		textRepresentation?: TextRepresentation;
		codeRepresentation?: CodeRepresentation;
		codeList?: CodeList;
		categories?: Category[];
	};
	typeOptions: { label: string; value: string }[];
	onSave: (data: {
		id: string;
		label: string;
		name: string;
		description?: string;
		type: string;
		isGeographic?: boolean;
		numericRepresentation?: NumericRepresentation;
		dateRepresentation?: DateTimeRepresentation;
		textRepresentation?: TextRepresentation;
		codeRepresentation?: CodeRepresentation;
		codeList?: CodeList;
		categories?: Category[];
	}) => void;
}

export const VariableEditForm = ({
	variable,
	typeOptions,
	onSave,
}: Readonly<VariableEditFormProps>) => {
	const { t } = useTranslation();

	const [state, dispatch] = useReducer(formReducer, {
		label: variable.label,
		name: variable.name,
		description: variable.description || '',
		selectedType: variable.type,
		isGeographic: variable.isGeographic || false,
		representation: {
			NumericRepresentation: variable.numericRepresentation,
			DateTimeRepresentation: variable.dateRepresentation,
			TextRepresentation: variable.textRepresentation,
			CodeRepresentation: variable.codeRepresentation,
			CodeList: variable.codeList,
			Category: variable.categories,
		},
	});

	useEffect(() => {
		dispatch({
			type: 'RESET',
			payload: {
				label: variable.label,
				name: variable.name,
				description: variable.description || '',
				selectedType: variable.type,
				isGeographic: variable.isGeographic || false,
				representation: {
					NumericRepresentation: variable.numericRepresentation,
					DateTimeRepresentation: variable.dateRepresentation,
					TextRepresentation: variable.textRepresentation,
					CodeRepresentation: variable.codeRepresentation,
					CodeList: variable.codeList,
					Category: variable.categories,
				},
			},
		});
	}, [
		variable.id,
		variable.label,
		variable.name,
		variable.description,
		variable.type,
		variable.isGeographic,
		variable.numericRepresentation,
		variable.dateRepresentation,
		variable.textRepresentation,
		variable.codeRepresentation,
		variable.codeList,
		variable.categories,
	]);

	const updateNumericRepresentation = useCallback(
		(numericRep: NumericRepresentation | undefined) => {
			dispatch({ type: 'SET_NUMERIC_REPRESENTATION', payload: numericRep });
		},
		[],
	);

	const updateDateRepresentation = useCallback(
		(dateRep: DateTimeRepresentation | undefined) => {
			dispatch({ type: 'SET_DATE_REPRESENTATION', payload: dateRep });
		},
		[],
	);

	const updateTextRepresentation = useCallback(
		(textRep: TextRepresentation | undefined) => {
			dispatch({ type: 'SET_TEXT_REPRESENTATION', payload: textRep });
		},
		[],
	);

	const updateCodeRepresentation = useCallback(
		(
			codeRep: CodeRepresentation | undefined,
			codeList?: CodeList,
			categories?: Category[],
		) => {
			dispatch({
				type: 'SET_CODE_REPRESENTATION',
				payload: { codeRep, codeList, categories },
			});
		},
		[],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			onSave({
				id: variable.id,
				label: state.label,
				name: state.name,
				description: state.description,
				type: state.selectedType,
				isGeographic: state.isGeographic,
				numericRepresentation:
					state.selectedType === 'numeric'
						? state.representation.NumericRepresentation
						: undefined,
				dateRepresentation:
					state.selectedType === 'date'
						? state.representation.DateTimeRepresentation
						: undefined,
				textRepresentation:
					state.selectedType === 'text'
						? state.representation.TextRepresentation
						: undefined,
				codeRepresentation:
					state.selectedType === 'code'
						? state.representation.CodeRepresentation
						: undefined,
				codeList:
					state.selectedType === 'code'
						? state.representation.CodeList
						: undefined,
				categories:
					state.selectedType === 'code'
						? state.representation.Category
						: undefined,
			});
		},
		[variable.id, state, onSave],
	);

	return (
		<Card title={t('physicalInstance.view.editVariable')} className="h-full">
			<form onSubmit={handleSubmit} className="flex flex-column gap-3">
				<div className="flex gap-2 justify-content-end">
					<Button
						type="button"
						label={t('physicalInstance.view.duplicate')}
						icon="pi pi-copy"
						outlined
						severity="secondary"
					/>
					<Button
						type="submit"
						label={t('physicalInstance.view.save')}
						icon="pi pi-save"
						outlined
					/>
				</div>

				<TabView>
					<TabPanel header={t('physicalInstance.view.tabs.information')}>
						<div className="flex flex-column gap-3">
							<div className="flex flex-column gap-2">
								<label htmlFor="variable-name">
									{t('physicalInstance.view.columns.name')}
								</label>
								<InputText
									id="variable-name"
									name="name"
									value={state.name}
									onChange={(e) =>
										dispatch({ type: 'SET_NAME', payload: e.target.value })
									}
									required
								/>
							</div>

							<div className="flex flex-column gap-2">
								<label htmlFor="variable-label">
									{t('physicalInstance.view.columns.label')}
								</label>
								<InputText
									id="variable-label"
									name="label"
									value={state.label}
									onChange={(e) =>
										dispatch({ type: 'SET_LABEL', payload: e.target.value })
									}
									required
								/>
							</div>

							<div className="flex flex-column gap-2">
								<label htmlFor="variable-description">
									{t('physicalInstance.view.columns.description')}
								</label>
								<InputTextarea
									id="variable-description"
									name="description"
									value={state.description}
									onChange={(e) =>
										dispatch({
											type: 'SET_DESCRIPTION',
											payload: e.target.value,
										})
									}
									rows={5}
								/>
							</div>
						</div>
					</TabPanel>

					<TabPanel header={t('physicalInstance.view.tabs.representation')}>
						<div className="flex flex-column gap-3">
							<div className="flex flex-column gap-2">
								<label htmlFor="variable-type">
									{t('physicalInstance.view.columns.type')}
								</label>
								<Dropdown
									key={`${variable.id}-type`}
									id="variable-type"
									name="type"
									value={state.selectedType}
									onChange={(e) =>
										dispatch({ type: 'SET_TYPE', payload: e.value })
									}
									options={typeOptions}
									placeholder={t('physicalInstance.view.selectType')}
									required
								/>
							</div>

							<div className="flex align-items-center gap-2">
								<Checkbox
									inputId="variable-isGeographic"
									name="isGeographic"
									checked={state.isGeographic}
									onChange={(e) =>
										dispatch({
											type: 'SET_IS_GEOGRAPHIC',
											payload: e.checked ?? false,
										})
									}
								/>
								<label htmlFor="variable-isGeographic">
									{t('physicalInstance.view.isGeographic')}
								</label>
							</div>

							{state.selectedType === 'numeric' && (
								<NumericRepresentationComponent
									representation={state.representation.NumericRepresentation}
									onChange={updateNumericRepresentation}
								/>
							)}

							{state.selectedType === 'date' && (
								<DateRepresentation
									representation={state.representation.DateTimeRepresentation}
									onChange={updateDateRepresentation}
								/>
							)}

							{state.selectedType === 'text' && (
								<TextRepresentationComponent
									representation={state.representation.TextRepresentation}
									onChange={updateTextRepresentation}
								/>
							)}

							{state.selectedType === 'code' && (
								<CodeRepresentationComponent
									representation={state.representation.CodeRepresentation}
									codeList={state.representation.CodeList}
									categories={state.representation.Category}
									onChange={updateCodeRepresentation}
								/>
							)}
						</div>
					</TabPanel>

					<TabPanel header={t('physicalInstance.view.tabs.ddiXml')}>
						{/* DDI XML content will be added here */}
					</TabPanel>
				</TabView>
			</form>
		</Card>
	);
};
