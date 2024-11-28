import { FeminineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth roles={[ADMIN]}>
				<FeminineButton action="/codelists/create" />
			</Auth>
		</VerticalMenu>
	);
};
