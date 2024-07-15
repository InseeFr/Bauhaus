import { Auth } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';
import { FeminineButton } from '../../../../new-architecture/components/new-button';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<FeminineButton action="/codelists/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
