import {
	ActionToolbar,
	Button,
	DeleteButton,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import { Auth, ValidationButton } from 'bauhaus-utilities';
import D from '../../../../i18n/build-dictionary';
import React from 'react';
import { useSelector } from 'react-redux';

export const ViewMenu = ({ dataset, onPublish, ...props }) => {
	const permission = useSelector(Auth.getPermission);

	const hasDatasetRightsBasedOnStamp =
		permission?.stamp === dataset?.catalogRecord?.contributor &&
		permission?.roles?.includes(Auth.DATASET_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, '/datasets')} />

			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<ValidationButton object={dataset} callback={onPublish} />
			)}
			{(isAdmin ||
				(hasDatasetRightsBasedOnStamp &&
					dataset.validationState === 'Unpublished')) && (
				<DeleteButton action={() => {}} />
			)}
			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<Button action={`/datasets/${dataset.id}/modify`} label={D.btnUpdate} />
			)}
		</ActionToolbar>
	);
};
