import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { useGoBack } from '@utils/hooks/useGoBack';

import { HasAccess } from '../../../auth/components/auth';
import { Dataset, Distribution } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { getContributors } from '../../utils/check-stamp-with-contributor';

interface ViewMenuTypes {
	distribution: Distribution;
	dataset: Dataset;
	onPublish: VoidFunction;
	onDelete: VoidFunction;
}

export const ViewMenu = ({
	distribution,
	dataset,
	onPublish,
	onDelete,
}: Readonly<ViewMenuTypes>) => {
	const goBack = useGoBack();

	const contributors = getContributors(dataset);
	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/datasets/distributions')} />

			<HasAccess
				module="DATASET_DISTRIBUTION"
				privilege="PUBLISH"
				stamps={contributors}
			>
				<ValidationButton object={distribution} callback={onPublish} />
			</HasAccess>

			<HasAccess
				module="DATASET_DISTRIBUTION"
				privilege="DELETE"
				stamps={contributors}
				complementaryCheck={dataset.validationState === UNPUBLISHED}
			>
				<DeleteButton action={onDelete} />
			</HasAccess>

			<HasAccess
				module="DATASET_DISTRIBUTION"
				privilege="UPDATE"
				stamps={contributors}
			>
				<UpdateButton
					action={`/datasets/distributions/${distribution.id}/modify`}
				/>
			</HasAccess>
		</ActionToolbar>
	);
};
