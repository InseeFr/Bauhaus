import { Auth, FeminineButton } from 'js/utils';
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
