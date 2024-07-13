import { Auth, FeminineButton } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<FeminineButton action="/datasets/distributions/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
