import { Auth } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';
import { FeminineButton } from '../../../../new-architecture/components/new-button';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<FeminineButton action="/datasets/distributions/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
