import D from 'js/i18n';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/datasets-api';
import './edit.scss';
import {
	ActionToolbar,
	CancelButton,
	goBack,
	goBackOrReplace,
	Loading,
	SaveButton,
} from '@inseefr/wilco';
import {
	Auth,
	GlobalClientSideErrorBloc,
	PageTitleBlock,
	useTitle,
} from 'bauhaus-utilities';
import { validate } from './validation';
import { LayoutWithLateralMenu } from './layout-with-lateral-menu';
import { useDataset } from '../hooks';
import { useSelector } from 'react-redux';
import {
	GlobalInformation,
	InternalManagement,
	Notes,
	StaticsInformations,
} from './edit-tabs';
import { withCodesLists } from 'js/hooks/hooks';

const Dataset = (props) => {
	const { id } = useParams();
	const isEditing = !!id;

	const [editingDataset, setEditingDataset] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const hasErrors = (keys) => {
		const fieldsInError = keys.filter((key) => clientSideErrors.fields?.[key]);
		return fieldsInError.length > 0;
	};

	const layoutConfiguration = {
		globalInformation: {
			title: D.globalInformationsTitle,
			children: {
				globalInformation: {
					title: D.globalInformationsTitle,
					isInError: hasErrors(['labelLg1', 'labelLg2']),
					content: () => {
						if (
							editingDataset?.updated &&
							editingDataset.updated.includes('T')
						) {
							editingDataset.updated = editingDataset.updated.substring(
								0,
								editingDataset.updated.indexOf('T')
							);
						}
						if (editingDataset?.issued && editingDataset.issued.includes('T')) {
							editingDataset.issued = editingDataset.issued.substring(
								0,
								editingDataset.issued.indexOf('T')
							);
						}

						return (
							<GlobalInformation
								editingDataset={editingDataset}
								setEditingDataset={setEditingDataset}
								clientSideErrors={clientSideErrors}
								setClientSideErrors={setClientSideErrors}
							/>
						);
					},
				},
				globalInternalManagementTitle: {
					title: D.globalInternalManagementTitle,
					isInError: hasErrors([
						'contributor',
						'creator',
						'disseminationStatus',
						'idSerie',
						'altIdentifier',
					]),
					content: () => (
						<InternalManagement
							editingDataset={editingDataset}
							setEditingDataset={setEditingDataset}
							clientSideErrors={clientSideErrors}
							setClientSideErrors={setClientSideErrors}
						/>
					),
				},
			},
		},
		notes: {
			title: D.notesTitle,
			children: {
				notes: {
					title: D.notesTitle,
					content: () => (
						<Notes
							editingDataset={editingDataset}
							setEditingDataset={setEditingDataset}
						/>
					),
				},
			},
		},
		staticsInformations: {
			title: D.staticsInformations,
			children: {
				staticsInformations: {
					title: D.staticsInformations,
					content: () => (
						<StaticsInformations
							editingDataset={editingDataset}
							setEditingDataset={setEditingDataset}
						/>
					),
				},
			},
		},
	};

	const { data: dataset, status } = useDataset(id);

	const permission = useSelector(Auth.getPermission);
	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(Auth.DATASET_CONTRIBUTOR) &&
		!permission?.roles?.includes(Auth.ADMIN);

	useEffect(() => {
		if (status === 'success') {
			setEditingDataset(dataset);
		} else if (isContributor && !id) {
			setEditingDataset({
				catalogRecord: {
					contributor: stamp,
				},
			});
		}
	}, [status, dataset, id, isContributor, stamp]);

	const queryClient = useQueryClient();

	const { isLoading: isSaving, mutate: save } = useMutation(
		(id) => {
			const formattedDataset = { themes: [], ...editingDataset };
			if (isEditing) {
				return api.putDataset(formattedDataset);
			}
			return api.postDataset(formattedDataset);
		},
		{
			onSuccess: (id) => {
				if (isEditing) {
					queryClient.invalidateQueries(['datasets', id]);
				}
				queryClient.invalidateQueries(['datasets']);

				goBackOrReplace(props, `/datasets/${id}`, !isEditing);
			},
		}
	);

	useTitle(D.datasetsTitle, editingDataset?.labelLg1 || D.datasetsCreateTitle);

	if (!dataset && isEditing) {
		return <Loading />;
	}
	if (isSaving) {
		return <Loading textType="saving" />;
	}

	const onSubmit = () => {
		const clientSideErrors = validate(editingDataset);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			save(editingDataset);
		}
	};

	const allChildrenItems = Object.values(layoutConfiguration).reduce(
		(acc, configuration) => {
			return {
				...acc,
				...configuration.children,
			};
		},
		{}
	);

	return (
		<div className="editor-container dataset-container">
			{isEditing && (
				<PageTitleBlock
					titleLg1={dataset.labelLg1}
					titleLg2={dataset.labelLg2}
					secondLang={true}
				/>
			)}

			<ActionToolbar>
				<CancelButton action={goBack(props, '/datasets')} />
				<SaveButton
					action={onSubmit}
					disabled={clientSideErrors.errorMessage?.length > 0}
				/>
			</ActionToolbar>
			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
					D={D}
				/>
			)}

			<form>
				<LayoutWithLateralMenu layoutConfiguration={layoutConfiguration}>
					{(key) => allChildrenItems[key].content()}
				</LayoutWithLateralMenu>
			</form>
		</div>
	);
};

export const DatasetEdit = withCodesLists([
	'CL_ACCESS_RIGHTS',
	'CL_FREQ',
	'CL_CONF_STATUS',
	'CL_DATA_TYPES',
	'CL_STAT_UNIT',
	'CL_PROCESS_STEP',
	'CL_GEO',
	'CL_TYPE_GEO',
])(Dataset);
