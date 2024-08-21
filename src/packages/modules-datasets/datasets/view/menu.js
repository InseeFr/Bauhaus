import {
	ActionToolbar,
	Button,
	DeleteButton,
	ReturnButton,
} from '@inseefr/wilco';
import D from '../../../deprecated-locales/build-dictionary';
import { useSelector } from 'react-redux';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { getPermission } from '../../../redux/selectors';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';

export const ViewMenu = ({ dataset, onPublish, onDelete, ...props }) => {
	const goBack = useGoBack();

	const permission = useSelector(getPermission);

	const hasDatasetRightsBasedOnStamp =
		permission?.stamp === dataset?.catalogRecord?.contributor &&
		permission?.roles?.includes(DATASET_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/datasets')} />

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
