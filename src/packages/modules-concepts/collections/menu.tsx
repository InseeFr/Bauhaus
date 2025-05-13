import {
	ExportButton,
	PublishButton,
} from '@components/buttons/buttons-with-icons';
import { FeminineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import { HasAccess } from '../../auth/components/auth';

export const Menu = () => {
	return (
		<VerticalMenu>
			<HasAccess module="CONCEPT_COLLECTION" privilege="CREATE">
				<FeminineButton action="/concepts/collections/create" />
			</HasAccess>
			<ExportButton action="/concepts/collections/export" wrapper={false} />
			<HasAccess module="CONCEPT_COLLECTION" privilege="READ">
				<PublishButton
					action="/concepts/collections/validation"
					wrapper={false}
				/>
			</HasAccess>
		</VerticalMenu>
	);
};
