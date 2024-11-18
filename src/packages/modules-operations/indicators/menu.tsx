import { ADMIN } from '../../auth/roles';
import Auth from '../../auth/components/auth';
import { VerticalMenu } from '../../components/vertical-menu';
import { MasculineButton } from '@components/new-button';

export const Menu = () => {
	return (
		<Auth roles={[ADMIN]}>
			<VerticalMenu>
				<MasculineButton action="/operations/indicator/create" />
			</VerticalMenu>
		</Auth>
	);
};
