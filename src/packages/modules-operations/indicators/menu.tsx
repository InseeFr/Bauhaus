import { ADMIN } from '../../auth/roles';
import { MasculineButton } from '../../components';
import Auth from '../../auth/components/auth';
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
