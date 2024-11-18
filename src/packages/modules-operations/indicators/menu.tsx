import { MasculineButton } from '@components/new-button';

import Auth from '../../auth/components/auth';
import { ADMIN } from '../../auth/roles';
import { VerticalMenu } from '../../components/vertical-menu';

export const Menu = () => {
	return (
		<Auth roles={[ADMIN]}>
			<VerticalMenu>
				<MasculineButton action="/operations/indicator/create" />
			</VerticalMenu>
		</Auth>
	);
};
