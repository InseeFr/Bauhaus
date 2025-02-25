import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { useGoBack } from '@utils/hooks/useGoBack';

import { ADMIN } from '../../../auth/roles';
import { Dataset } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { usePermission } from '../../../redux/hooks/usePermission';
import { checkIfContributorContainsUserStamp } from '../../utils/check-stamp-with-contributor';

interface ViewMenuTypes {
	dataset: Dataset;
	onPublish: VoidFunction;
	onDelete: VoidFunction;
}
export const ViewMenu = ({
	dataset,
	onPublish,
	onDelete,
}: Readonly<ViewMenuTypes>) => {
	const goBack = useGoBack();

	const permission = usePermission();

	const hasDatasetRightsBasedOnStamp = checkIfContributorContainsUserStamp(
		dataset,
		permission,
	);

	const isAdmin = permission?.roles?.includes(ADMIN);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/datasets')} />

			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<ValidationButton
					object={dataset}
					callback={onPublish}
					disabled={false}
				/>
			)}
			{(isAdmin ||
				(hasDatasetRightsBasedOnStamp &&
					dataset.validationState === UNPUBLISHED)) && (
				<DeleteButton action={onDelete} />
			)}
			{(isAdmin || hasDatasetRightsBasedOnStamp) && (
				<UpdateButton action={`/datasets/${dataset.id}/modify`} />
			)}
		</ActionToolbar>
	);
};
