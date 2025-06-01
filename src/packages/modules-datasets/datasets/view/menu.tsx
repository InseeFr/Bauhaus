import { ActionToolbar } from '@components/action-toolbar';
import {
	DeleteButton,
	ReturnButton,
	UpdateButton,
} from '@components/buttons/buttons-with-icons';
import { ValidationButton } from '@components/validationButton';

import { useGoBack } from '@utils/hooks/useGoBack';

import { HasAccess } from '../../../auth/components/auth';
import { Dataset } from '../../../model/Dataset';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { getContributors } from '../../utils/check-stamp-with-contributor';

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

	const contributors = getContributors(dataset);

	return (
		<ActionToolbar>
			<ReturnButton action={() => goBack('/datasets')} />

			<HasAccess
				module="DATASET_DATASET"
				privilege="PUBLISH"
				stamps={contributors}
			>
				<ValidationButton
					object={dataset}
					callback={onPublish}
					disabled={false}
				/>
			</HasAccess>
			<HasAccess
				module="DATASET_DATASET"
				privilege="DELETE"
				stamps={contributors}
				complementaryCheck={dataset.validationState === UNPUBLISHED}
			>
				<DeleteButton action={onDelete} />
			</HasAccess>

			<HasAccess
				module="DATASET_DATASET"
				privilege="UPDATE"
				stamps={contributors}
			>
				<UpdateButton action={`/datasets/${dataset.id}/modify`} />
			</HasAccess>
		</ActionToolbar>
	);
};
