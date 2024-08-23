import {
	ActionToolbar,
	Button,
	DeleteButton,
	ReturnButton,
} from '@inseefr/wilco';
import D from '../../../deprecated-locales/build-dictionary';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';

export const ViewMenu = ({ dataset, onPublish, onDelete }) => {
	const goBack = useGoBack();

	const permission = usePermission();

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
