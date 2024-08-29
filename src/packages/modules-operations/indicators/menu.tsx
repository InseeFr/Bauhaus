import { ADMIN } from '../../auth/roles';
import { VerticalMenu } from '@inseefr/wilco';
import { MasculineButton } from '../../components';
import Auth from '../../auth/components/auth';

export const Menu = () => {
	return (
		<Auth roles={[ADMIN]}>
			<VerticalMenu>
				<MasculineButton action="/operations/indicator/create" />
			</VerticalMenu>
		</Auth>
	);
};
