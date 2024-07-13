import {
	ActionToolbar,
	Button,
	DeleteButton,
	goBack,
	ReturnButton,
} from '@inseefr/wilco';
import { Auth, ValidationButton } from '../../../../utils';
import { useSelector } from 'react-redux';
import D from '../../../../i18n/build-dictionary';
import { UNPUBLISHED } from '../../../../new-architecture/model/ValidationState';

export const ViewMenu = ({
	distribution,
	dataset,
	onPublish,
	onDelete,
	...props
}) => {
	const permission = useSelector(Auth.getPermission);

	const hasDatasetRightsBasedOnStamp =
		permission?.stamp === dataset?.catalogRecord?.contributor &&
		permission?.roles?.includes(Auth.DATASET_CONTRIBUTOR);
	const isAdmin = permission?.roles?.includes(Auth.ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={goBack(props, '/datasets/distributions')} />

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
