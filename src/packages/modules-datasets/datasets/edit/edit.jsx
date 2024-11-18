import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import { GlobalClientSideErrorBloc } from '@components/errors-bloc';
import { Loading, Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';

import { initializeContributorProperty } from '@utils/creation/contributor-init';
import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import D from '../../../deprecated-locales';
import { usePermission } from '../../../redux/hooks/usePermission';
import { DatasetsApi } from '../../../sdk';
import { useDataset } from '../../datasets';
import './edit.scss';
import { LayoutWithLateralMenu } from './layout-with-lateral-menu';
import { GlobalInformation } from './tabs/global-information';
import { InternalManagement } from './tabs/internal-management';
import { Notes } from './tabs/notes';
import { StatisticalInformation } from './tabs/statistical-information';
import { validate } from './validation';

export const Component = () => {
	const { id } = useParams();
	const isEditing = !!id;

	const goBack = useGoBack();

	const [editingDataset, setEditingDataset] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const hasErrors = (keys) => {
		const fieldsInError = keys.filter((key) => clientSideErrors.fields?.[key]);
		return fieldsInError.length > 0;
	};

	const { data: dataset, status } = useDataset(id);

	const permission = usePermission();

	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(DATASET_CONTRIBUTOR) &&
		!permission?.roles?.includes(ADMIN);

	useEffect(() => {
		if (status === 'success') {
			setEditingDataset(dataset);
		} else if (isContributor && !id) {
			setEditingDataset({
				catalogRecord: {
					...initializeContributorProperty(isContributor, !id, stamp),
				},
			});
		}
	}, [status, dataset, id, isContributor, stamp]);

	const queryClient = useQueryClient();

	const { isPending: isSaving, mutate: save } = useMutation({
		mutationFn: () => {
			const formattedDataset = { themes: [], ...editingDataset };
			if (isEditing) {
				return DatasetsApi.putDataset(formattedDataset);
			}
			return DatasetsApi.postDataset(formattedDataset);
		},

		onSuccess: (id) => {
			if (isEditing) {
				queryClient.invalidateQueries(['datasets', id]);
			}
			queryClient.invalidateQueries(['datasets']);

			goBack(`/datasets/${id}`, !isEditing);
		},
	});

	useTitle(D.datasetsTitle, editingDataset?.labelLg1);

	if (!editingDataset.id && isEditing) {
		return <Loading />;
	}
	if (isSaving) {
		return <Saving />;
	}

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
								editingDataset.updated.indexOf('T'),
							);
						}
						if (editingDataset?.issued && editingDataset.issued.includes('T')) {
							editingDataset.issued = editingDataset.issued.substring(
								0,
								editingDataset.issued.indexOf('T'),
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
				internalManagement: {
					title: D.internalManagementTitle,
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
		statisticalInformation: {
			title: D.statisticalInformation,
			children: {
				statisticalInformation: {
					title: D.statisticalInformation,
					content: () => (
						<StatisticalInformation
							editingDataset={editingDataset}
							setEditingDataset={setEditingDataset}
						/>
					),
				},
			},
		},
	};

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
		{},
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
				<CancelButton action={() => goBack('/datasets')} />
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
