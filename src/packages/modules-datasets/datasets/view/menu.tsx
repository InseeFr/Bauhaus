import { ADMIN } from '../../../auth/roles';
import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { Dataset } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { usePermission } from '../../../redux/hooks/usePermission';
import { useGoBack } from '@utils/hooks/useGoBack';
import { checkIfContributorContainsUserStamp } from '../../utils/check-stamp-with-contributor';
import { ValidationButton } from '@components/validationButton';

type ViewMenuTypes = {
	dataset: Dataset;
	onPublish: () => void;
	onDelete: () => void;
};
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
