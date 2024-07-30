import {
	ActionToolbar,
	Button,
	DeleteButton,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import { Auth } from '../../../../utils';
import D from '../../../../i18n/build-dictionary';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';
import { ValidationButton } from '../../../../new-architecture/components';

export const ViewMenu = ({ dataset, onPublish, onDelete, ...props }) => {
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
					dataset.validationState === UNPUBLISHED)) && (
				<DeleteButton action={onDelete} />
			)}
			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<Button action={`/datasets/${dataset.id}/modify`} label={D.btnUpdate} />
			)}
		</ActionToolbar>
	);
};
