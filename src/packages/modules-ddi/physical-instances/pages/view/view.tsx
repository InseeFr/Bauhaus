import { useReducer, useRef, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { EditModal } from '../../components/EditModal/EditModal';
import { SearchFilters } from '../../components/SearchFilters/SearchFilters';
import { GlobalActionsCard } from '../../components/GlobalActionsCard/GlobalActionsCard';
import { VariableEditForm } from '../../components/VariableEditForm/VariableEditForm';
import { usePhysicalInstancesData } from '../../../hooks/usePhysicalInstance';
import { useUpdatePhysicalInstance } from '../../../hooks/useUpdatePhysicalInstance';
import { viewReducer, initialState, actions } from './viewReducer';
import {
	FILTER_ALL_TYPES,
	TOAST_DURATION,
	VARIABLE_TYPES,
} from '../../constants';
import type { VariableTableData } from '../../types/api';
import { Loading } from '../../../../components/loading';
import { DDIApi } from '../../../../sdk';

export const Component = () => {
	const { id, agencyId } = useParams<{ id: string; agencyId: string }>();
	const { t } = useTranslation();
	const toast = useRef<Toast>(null);
	const [state, dispatch] = useReducer(viewReducer, initialState);
	const {
		data,
		variables,
		title,
		dataRelationshipName,
		isLoading,
		isError,
		error,
	} = usePhysicalInstancesData(agencyId!, id!);
	const updatePhysicalInstance = useUpdatePhysicalInstance();

	useEffect(() => {
		if (title || dataRelationshipName) {
			dispatch(
				actions.setFormData({ label: title, name: dataRelationshipName }),
			);
		}
	}, [title, dataRelationshipName]);

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

	const handleExport = useCallback(
		async (format: 'DDI3' | 'DDI4') => {
			try {
				let exportedData: string;
				let fileName: string;

				if (format === 'DDI3') {
					// Appel de l'API pour convertir en DDI3
					const result = await DDIApi.convertToDDI3(data);
					exportedData = result;
					// Nettoyer le titre pour créer un nom de fichier valide
					const sanitizedTitle = title
						.replace(/[^a-z0-9]/gi, '_')
						.toLowerCase();
					fileName = `${sanitizedTitle}-ddi3.xml`;
				} else {
					// Pour DDI4, on utilise les données telles quelles
					exportedData = JSON.stringify(data, null, 2);
					const sanitizedTitle = title
						.replace(/[^a-z0-9]/gi, '_')
						.toLowerCase();
					fileName = `${sanitizedTitle}-ddi4.json`;
				}

				// Créer un blob et déclencher le téléchargement
				const blob = new Blob([exportedData], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);

				// Affichage du toast de succès
				toast.current?.show({
					severity: 'success',
					summary: t('physicalInstance.view.exportSuccess'),
					detail: t('physicalInstance.view.exportSuccessDetail', { format }),
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
		},
		[data, title, t],
	);

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

	const handleFormDataChange = useCallback(
		(data: { label: string; name: string }) => {
			dispatch(actions.setFormData(data));
		},
		[],
	);

	const handleSave = useCallback(async () => {
		try {
			await updatePhysicalInstance.mutateAsync({
				id: id!,
				agencyId: agencyId!,
				data: {
					physicalInstanceLabel: state.formData.label,
					dataRelationshipName: state.formData.name,
				},
			});

			toast.current?.show({
				severity: 'success',
				summary: t('physicalInstance.view.saveSuccess'),
				detail: t('physicalInstance.view.saveSuccessDetail'),
				life: TOAST_DURATION,
			});

			dispatch(actions.setEditModalVisible(false));
		} catch (err: unknown) {
			const errorMessage =
				err && typeof err === 'object' && 'message' in err
					? String(err.message)
					: t('physicalInstance.view.saveErrorDetail');

			toast.current?.show({
				severity: 'error',
				summary: t('physicalInstance.view.saveError'),
				detail: errorMessage,
				life: TOAST_DURATION,
			});
		}
	}, [state.formData, id, t, updatePhysicalInstance]);

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
			console.debug('Save variable:', data);
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
			<div className={state.selectedVariable ? 'col-8' : 'col-12'}>
				<div className="flex align-items-center gap-2 mb-3">
					<h1 className="m-0">{title}</h1>
					<Button
						icon="pi pi-pencil"
						text
						rounded
						aria-label={t('physicalInstance.view.editTitle')}
						onClick={handleOpenEditModal}
					/>
				</div>
				<div className="mb-3">
					<p className="text-gray-600">{dataRelationshipName}</p>
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
					onExport={handleExport}
					onRowClick={handleVariableClick}
				/>
			</div>
			{state.selectedVariable && (
				<div className="col-4" role="complementary">
					<VariableEditForm
						variable={state.selectedVariable}
						typeOptions={variableTypeOptions}
						onSave={handleVariableSave}
					/>
				</div>
			)}

			<EditModal
				visible={state.isEditModalVisible}
				onHide={handleCloseEditModal}
				formData={state.formData}
				onFormDataChange={handleFormDataChange}
				onSave={handleSave}
			/>

			<Toast ref={toast} />
		</div>
	);
};
