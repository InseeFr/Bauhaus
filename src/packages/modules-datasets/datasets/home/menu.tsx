import { MasculineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import { HasAccess } from '../../../auth/components/auth';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<HasAccess module="DATASET_DATASET" privilege="CREATE">
				<MasculineButton action="/datasets/create" />
			</HasAccess>
		</VerticalMenu>
	);
};
