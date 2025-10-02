import { useReducer, useRef, useMemo, useCallback } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { EditModal } from '../../components/EditModal/EditModal';
import { ImportModal } from '../../components/ImportModal/ImportModal';
import { SearchFilters } from '../../components/SearchFilters/SearchFilters';
import { GlobalActionsCard } from '../../components/GlobalActionsCard/GlobalActionsCard';
import { VariableEditForm } from '../../components/VariableEditForm/VariableEditForm';
import { usePhysicalInstancesData } from '../../../hooks/usePhysicalInstance';
import { viewReducer, initialState, actions } from './viewReducer';
import {
	FILTER_ALL_TYPES,
	TOAST_DURATION,
	EXPORT_DELAY,
	VARIABLE_TYPES,
} from '../../constants';
import type { VariableTableData } from '../../types/api';
import { Loading } from '../../../../components/loading';

export const Component = () => {
	const { t } = useTranslation();
	const toast = useRef<Toast>(null);
	const [state, dispatch] = useReducer(viewReducer, initialState);
	const { variables, isLoading, isError, error } = usePhysicalInstancesData();

	const variableTypeOptions = useMemo(
		() => [
			{
				label: t('physicalInstance.view.variableTypes.text'),
				value: VARIABLE_TYPES.TEXT,
			},
			{
				label: t('physicalInstance.view.variableTypes.code'),
				value: VARIABLE_TYPES.CODE,
			},
			{
				label: t('physicalInstance.view.variableTypes.date'),
				value: VARIABLE_TYPES.DATE,
			},
			{
				label: t('physicalInstance.view.variableTypes.numeric'),
				value: VARIABLE_TYPES.NUMERIC,
			},
		],
		[t],
	);

	const typeOptions = useMemo(() => {
		return [
			{ label: t('physicalInstance.view.allTypes'), value: FILTER_ALL_TYPES },
			...variableTypeOptions,
		];
	}, [variableTypeOptions, t]);

	const filteredVariables = useMemo(() => {
		let filtered = variables;

		// Filtre par recherche
		if (state.searchValue) {
			const searchLower = state.searchValue.toLowerCase();
			filtered = filtered.filter((variable: VariableTableData) => {
				const nameMatch = variable.name.toLowerCase().includes(searchLower);
				const labelMatch = variable.label.toLowerCase().includes(searchLower);
				return nameMatch || labelMatch;
			});
		}
		// Filtre par type
		if (state.typeFilter !== FILTER_ALL_TYPES) {
			filtered = filtered.filter(
				(variable: VariableTableData) =>
					variable.type.toLowerCase() === state.typeFilter.toLowerCase(),
			);
		}

		return filtered;
	}, [variables, state.searchValue, state.typeFilter]);

	const handleExport = useCallback(async () => {
		try {
			// Traitement asynchrone fictif
			await new Promise((resolve) => setTimeout(resolve, EXPORT_DELAY));

			const exportedData = JSON.stringify({ variables }, null, 2);

			// Vérifier si clipboard est disponible
			if (!navigator.clipboard) {
				throw new Error('Clipboard API not available');
			}

			// Copie dans le clipboard
			await navigator.clipboard.writeText(exportedData);

			// Affichage du toast de succès
			toast.current?.show({
				severity: 'success',
				summary: t('physicalInstance.view.exportSuccess'),
				detail: t('physicalInstance.view.exportSuccessDetail'),
				life: TOAST_DURATION,
			});
		} catch (err) {
			// Affichage du toast d'erreur
			toast.current?.show({
				severity: 'error',
				summary: t('physicalInstance.view.exportError'),
				detail:
					err instanceof Error
						? err.message
						: t('physicalInstance.view.exportErrorDetail'),
				life: TOAST_DURATION,
			});
		}
	}, [variables, t]);

	const handleSearchChange = useCallback((value: string) => {
		dispatch(actions.setSearchValue(value));
	}, []);

	const handleTypeFilterChange = useCallback((value: string) => {
		dispatch(actions.setTypeFilter(value));
	}, []);

	const handleOpenEditModal = useCallback(() => {
		dispatch(actions.setEditModalVisible(true));
	}, []);

	const handleCloseEditModal = useCallback(() => {
		dispatch(actions.setEditModalVisible(false));
	}, []);

	const handleOpenImportModal = useCallback(() => {
		dispatch(actions.setImportModalVisible(true));
	}, []);

	const handleCloseImportModal = useCallback(() => {
		dispatch(actions.setImportModalVisible(false));
	}, []);

	const handleFormDataChange = useCallback(
		(data: { label: string; name: string }) => {
			dispatch(actions.setFormData(data));
		},
		[],
	);

	const handleImportDataChange = useCallback((data: string) => {
		dispatch(actions.setImportData(data));
	}, []);

	const handleSave = useCallback(() => {
		// TODO: Save logic
		dispatch(actions.setEditModalVisible(false));
	}, []);

	const handleImport = useCallback(() => {
		// TODO: Import logic
		dispatch(actions.setImportModalVisible(false));
		dispatch(actions.setImportData(''));
	}, []);

	const handleVariableClick = useCallback((variable: VariableTableData) => {
		dispatch(
			actions.setSelectedVariable({
				id: variable.id,
				label: variable.label,
				name: variable.name,
				type: variable.type,
			}),
		);
	}, []);

	const handleNewVariable = useCallback(() => {
		dispatch(
			actions.setSelectedVariable({
				id: 'new',
				label: '',
				name: '',
				type: VARIABLE_TYPES.TEXT,
			}),
		);
	}, []);

	const handleVariableSave = useCallback(
		(data: { id: string; label: string; name: string; type: string }) => {
			// TODO: Save variable logic
			console.log('Save variable:', data);
		},
		[],
	);

	if (isLoading) {
		return <Loading />;
	}

	if (isError) {
		return (
			<div role="alert" aria-live="assertive">
				<Message
					severity="error"
					text={
						error instanceof Error
							? error.message
							: t('physicalInstance.view.errorLoading')
					}
				/>
			</div>
		);
	}

	return (
		<div className="flex" role="main">
			<div className="col-8">
				<div className="flex align-items-center gap-2 mb-3">
					<h1 className="m-0">TODO</h1>
					<Button
						icon="pi pi-pencil"
						text
						rounded
						aria-label={t('physicalInstance.view.editTitle')}
						onClick={handleOpenEditModal}
					/>
				</div>

				<SearchFilters
					searchValue={state.searchValue}
					onSearchChange={handleSearchChange}
					typeFilter={state.typeFilter}
					onTypeFilterChange={handleTypeFilterChange}
					typeOptions={typeOptions}
					onNewVariable={handleNewVariable}
				/>

				<GlobalActionsCard
					variables={filteredVariables}
					onImport={handleOpenImportModal}
					onExport={handleExport}
					onRowClick={handleVariableClick}
				/>
			</div>
			<div className="col-4" role="complementary">
				{state.selectedVariable ? (
					<VariableEditForm
						variable={state.selectedVariable}
						typeOptions={variableTypeOptions}
						onSave={handleVariableSave}
					/>
				) : (
					<div className="text-center text-gray-500 mt-4">
						{t('physicalInstance.view.selectVariable')}
					</div>
				)}
			</div>

			<EditModal
				visible={state.isEditModalVisible}
				onHide={handleCloseEditModal}
				formData={state.formData}
				onFormDataChange={handleFormDataChange}
				onSave={handleSave}
			/>

			<ImportModal
				visible={state.isImportModalVisible}
				onHide={handleCloseImportModal}
				importData={state.importData}
				onImportDataChange={handleImportDataChange}
				onImport={handleImport}
			/>

			<Toast ref={toast} />
		</div>
	);
};
