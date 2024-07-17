import { Auth } from '../../../../utils';
import { VerticalMenu } from '@inseefr/wilco';
import { MasculineButton } from '../../../../new-architecture/components/new-button';
export const HomePageMenu = ({ filter }) => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<MasculineButton
					action={
						'/structures/components/create?type=' + encodeURIComponent(filter)
					}
				/>
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
