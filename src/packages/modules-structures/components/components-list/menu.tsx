import Auth from '../../../auth/components/auth';
import { MasculineButton } from '../../../components';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { VerticalMenu } from '../../../components/vertical-menu';
export const HomePageMenu = ({ filter }) => {
	return (
		<VerticalMenu>
			<Auth roles={[ADMIN, STRUCTURE_CONTRIBUTOR]}>
				<MasculineButton
					action={
						'/structures/components/create?type=' + encodeURIComponent(filter)
					}
				/>
			</Auth>
		</VerticalMenu>
	);
};
