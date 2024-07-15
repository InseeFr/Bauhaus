import { Auth } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';
import { MasculineButton } from '../../../../new-architecture/components/new-button';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<MasculineButton action="/datasets/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
