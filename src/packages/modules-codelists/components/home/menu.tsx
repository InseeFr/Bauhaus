import { FeminineButton } from '../../../components';
import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
import { VerticalMenu } from '../../../components/vertical-menu';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth roles={[ADMIN]}>
				<FeminineButton action="/codelists/create" />
			</Auth>
		</VerticalMenu>
	);
};
