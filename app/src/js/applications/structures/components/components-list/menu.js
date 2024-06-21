import { Auth, MasculineButton } from 'js/utils';
import { VerticalMenu } from '@inseefr/wilco';
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
