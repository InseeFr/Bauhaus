import {
	ActionToolbar,
	Button,
	DeleteButton,
	ReturnButton,
} from '@inseefr/wilco';
import { Auth } from '../../../../utils';
import { useSelector } from 'react-redux';
import D from '../../../../i18n/build-dictionary';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';
import { ValidationButton } from '../../../../new-architecture/components';
import { useGoBack } from '../../../../new-architecture/utils/hooks/useGoBack';

export const ViewMenu = ({
	distribution,
	dataset,
	onPublish,
	onDelete,
	...props
}) => {
	const goBack = useGoBack();

	const permission = useSelector(Auth.getPermission);

	const hasDatasetRightsBasedOnStamp =
		permission?.stamp === dataset?.catalogRecord?.contributor &&
		permission?.roles?.includes(Auth.DATASET_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

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
