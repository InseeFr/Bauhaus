import { useReducer, useRef, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { confirmDialog } from 'primereact/confirmdialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import './view.css';
import { EditModal } from '../../components/EditModal/EditModal';
import { SearchFilters } from '../../components/SearchFilters/SearchFilters';
import { GlobalActionsCard } from '../../components/GlobalActionsCard/GlobalActionsCard';
import { VariableEditForm } from '../../components/VariableEditForm/VariableEditForm';
import { usePhysicalInstancesData } from '../../../hooks/usePhysicalInstance';
import { useUpdatePhysicalInstance } from '../../../hooks/useUpdatePhysicalInstance';
import {
	viewReducer,
	initialState,
	actions,
	type VariableData,
} from './viewReducer';
import {
	FILTER_ALL_TYPES,
	TOAST_DURATION,
	VARIABLE_TYPES,
} from '../../constants';
import type {
	VariableTableData,
	Variable,
	CodeList,
	Code,
	Category,
} from '../../types/api';
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

	// Get IDs of unsaved (local) variables
	const unsavedVariableIds = useMemo(() => {
		return state.localVariables.map((v) => v.id);
	}, [state.localVariables]);

	// Merge variables from API with local modifications
	const mergedVariables = useMemo(() => {
		const variableMap = new Map(variables.map((v) => [v.id, v]));

		// Apply local modifications and add new local variables
		state.localVariables.forEach((localVar) => {
			if (variableMap.has(localVar.id)) {
				// Update existing variable
				variableMap.set(localVar.id, {
					...variableMap.get(localVar.id),
					...localVar,
				});
			} else {
				// Add new local variable with lastModified
				variableMap.set(localVar.id, {
					...localVar,
					lastModified: new Date().toISOString(),
				});
			}
		});

		return Array.from(variableMap.values());
	}, [variables, state.localVariables]);

	const filteredVariables = useMemo(() => {
		let filtered = mergedVariables;

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
	}, [mergedVariables, state.searchValue, state.typeFilter]);

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
					dataRelationshipName: 'DataRelationShip Name:' + state.formData.label,
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
	}, [state.formData, id, agencyId, t, updatePhysicalInstance]);

	const handleVariableClick = useCallback(
		(variable: VariableTableData) => {
			// Vérifier d'abord si la variable a des modifications locales
			const localVariable = state.localVariables.find(
				(v) => v.id === variable.id,
			);

			if (localVariable) {
				// Utiliser les données locales si elles existent
				dispatch(actions.setSelectedVariable(localVariable));
			} else {
				// Sinon, trouver la variable complète dans les données brutes
				const fullVariable = data?.Variable?.find(
					(v: Variable) => v.ID === variable.id,
				);

				// Charger les informations complètes de la variable si trouvée
				const description =
					fullVariable?.Description?.Content?.['#text'] || undefined;
				const isGeographic = fullVariable?.['@isGeographic'] === 'true';
				const textRepresentation =
					fullVariable?.VariableRepresentation?.TextRepresentation;
				const numericRepresentation =
					fullVariable?.VariableRepresentation?.NumericRepresentation;
				const dateRepresentation =
					fullVariable?.VariableRepresentation?.DateTimeRepresentation;
				const codeRepresentation =
					fullVariable?.VariableRepresentation?.CodeRepresentation;

				// Charger la CodeList et les Categories associées si disponibles
				let codeList = undefined;
				let categories = undefined;

				if (codeRepresentation) {
					const codeListId = codeRepresentation.CodeListReference.ID;
					codeList = data?.CodeList?.find(
						(cl: CodeList) => cl.ID === codeListId,
					);

					if (codeList && codeList.Code) {
						// Récupérer toutes les catégories liées aux codes
						const categoryIds = codeList.Code.map(
							(code: Code) => code.CategoryReference.ID,
						);
						categories = data?.Category?.filter((cat: Category) =>
							categoryIds.includes(cat.ID),
						);
					}
				}

				dispatch(
					actions.setSelectedVariable({
						id: variable.id,
						label: variable.label,
						name: variable.name,
						description,
						type: variable.type,
						isGeographic,
						textRepresentation,
						numericRepresentation,
						dateRepresentation,
						codeRepresentation,
						codeList,
						categories,
					}),
				);
			}
		},
		[data, state.localVariables],
	);

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
		(data: VariableData) => {
			// Si l'ID est 'new', c'est une nouvelle variable
			if (data.id === 'new') {
				const newId = `local-${Date.now()}`;
				dispatch(
					actions.addVariable({
						...data,
						id: newId,
					}),
				);
			} else {
				// Mise à jour d'une variable existante
				dispatch(actions.updateVariable(data));
			}

			// Fermer le formulaire
			dispatch(actions.setSelectedVariable(null));

			toast.current?.show({
				severity: 'success',
				summary: t('physicalInstance.view.variableSaveSuccess'),
				detail: t('physicalInstance.view.variableSaveSuccessDetail'),
				life: TOAST_DURATION,
			});
		},
		[t],
	);

	const handleVariableDuplicate = useCallback(
		(data: VariableData) => {
			// Ajouter la variable dupliquée
			dispatch(actions.addVariable(data));

			// Garder le formulaire ouvert avec la nouvelle variable
			dispatch(actions.setSelectedVariable(data));

			toast.current?.show({
				severity: 'success',
				summary: t('physicalInstance.view.variableDuplicateSuccess'),
				detail: t('physicalInstance.view.variableDuplicateSuccessDetail'),
				life: TOAST_DURATION,
			});
		},
		[t],
	);

	const handleDeleteVariable = useCallback(
		(variable: VariableTableData) => {
			confirmDialog({
				message: t('physicalInstance.view.deleteVariableConfirmMessage', {
					name: variable.name,
				}),
				header: t('physicalInstance.view.deleteVariableConfirmTitle'),
				icon: 'pi pi-exclamation-triangle',
				acceptLabel: t('physicalInstance.view.confirmDelete'),
				rejectLabel: t('physicalInstance.view.cancelDelete'),
				acceptClassName: 'p-button-danger',
				accept: () => {
					// Supprimer la variable des variables locales
					dispatch(actions.deleteVariable(variable.id));

					// Fermer le formulaire d'édition si la variable supprimée est sélectionnée
					if (state.selectedVariable?.id === variable.id) {
						dispatch(actions.setSelectedVariable(null));
					}

					toast.current?.show({
						severity: 'success',
						summary: t('physicalInstance.view.deleteVariableSuccess'),
						detail: t('physicalInstance.view.deleteVariableSuccessDetail'),
						life: TOAST_DURATION,
					});
				},
			});
		},
		[t, state.selectedVariable],
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
			<div
				className={state.selectedVariable ? 'col-8' : 'col-12'}
				style={{
					width: state.selectedVariable ? '66.666%' : '100%',
					transition: 'width 0.3s ease',
				}}
			>
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
					onDeleteClick={handleDeleteVariable}
					unsavedVariableIds={unsavedVariableIds}
				/>
			</div>
			{state.selectedVariable && (
				<div className="col-4" role="complementary">
					<VariableEditForm
						variable={state.selectedVariable}
						typeOptions={variableTypeOptions}
						onSave={handleVariableSave}
						onDuplicate={handleVariableDuplicate}
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

			<ConfirmDialog />
			<Toast ref={toast} />
		</div>
	);
};
