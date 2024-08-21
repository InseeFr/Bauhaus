import { VerticalMenu } from '@inseefr/wilco';
import { FeminineButton } from '../../../components/new-button';
import Auth from '../../../auth/components/auth';
import { ADMIN, DATASET_CONTRIBUTOR } from '../../../auth/roles';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth roles={[ADMIN, DATASET_CONTRIBUTOR]}>
				<FeminineButton action="/datasets/distributions/create" />
			</Auth>
		</VerticalMenu>
	);
};
