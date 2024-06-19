import { Auth, MasculineButton } from 'js/utils';
import { VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<MasculineButton action="/datasets/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
