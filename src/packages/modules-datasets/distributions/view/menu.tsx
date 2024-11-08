import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';
import { ValidationButton } from '../../../components';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '../../../components/buttons/buttons-with-icons';
import { Dataset, Distribution } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { usePermission } from '../../../redux/hooks/usePermission';
import { useGoBack } from '../../../utils/hooks/useGoBack';

type ViewMenuTypes = {
	distribution: Distribution;
	dataset: Dataset;
	onPublish: () => void;
	onDelete: () => void;
};

export const ViewMenu = ({
	distribution,
	dataset,
	onPublish,
	onDelete,
}: Readonly<ViewMenuTypes>) => {
	const goBack = useGoBack();

	const permission = usePermission();

	const contributors = Array.isArray(dataset?.catalogRecord?.contributor)
		? dataset?.catalogRecord?.contributor
		: [dataset?.catalogRecord?.contributor];

	const hasDatasetRightsBasedOnStamp =
		contributors.find((c) => c === permission?.stamp) &&
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
				<UpdateButton
					action={`/datasets/distributions/${distribution.id}/modify`}
				/>
			)}
		</ActionToolbar>
	);
};
