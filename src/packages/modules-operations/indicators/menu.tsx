import { MasculineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import { HasAccess } from '../../auth/components/auth';

export const Menu = () => {
	return (
		<HasAccess module="OPERATION_INDICATOR" privilege="CREATE">
			<VerticalMenu>
				<MasculineButton action="/operations/indicator/create" />
			</VerticalMenu>
		</HasAccess>
	);
};
