import { VerticalMenu } from '@inseefr/wilco';
import { FeminineButton } from '../../../components';
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
