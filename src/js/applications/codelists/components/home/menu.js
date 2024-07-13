import { Auth, FeminineButton } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<FeminineButton action="/codelists/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
