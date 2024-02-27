import { Auth, MasculineButton } from 'bauhaus-utilities';
import { VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<MasculineButton
					action="/datasets/create"
				/>
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
