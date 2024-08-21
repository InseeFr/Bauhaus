import {
	ActionToolbar,
	Button,
	DeleteButton,
	ReturnButton,
} from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import D from '../../../deprecated-locales/build-dictionary';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { ValidationButton } from '../../../components';
import { useGoBack } from '../../../utils/hooks/useGoBack';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { getPermission } from '../../../redux/selectors';

export const ViewMenu = ({
	distribution,
	dataset,
	onPublish,
	onDelete,
	...props
}) => {
	const goBack = useGoBack();

	const permission = useSelector(getPermission);

	const hasDatasetRightsBasedOnStamp =
		permission?.stamp === dataset?.catalogRecord?.contributor &&
		permission?.roles?.includes(DATASET_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/datasets/distributions')} />

			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<ValidationButton object={distribution} callback={onPublish} />
			)}
			{(isAdmin ||
				(hasDatasetRightsBasedOnStamp &&
					dataset.validationState === UNPUBLISHED)) && (
				<DeleteButton action={onDelete} />
			)}
			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<Button
					action={`/datasets/distributions/${distribution.id}/modify`}
					label={D.btnUpdate}
				/>
			)}
		</ActionToolbar>
	);
};
