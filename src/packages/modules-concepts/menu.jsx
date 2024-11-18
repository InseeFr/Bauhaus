import {
	ExportButton,
	PublishButton,
} from '@components/buttons/buttons-with-icons';
import { MasculineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import check from '../auth/auth';
import Auth from '../auth/components/auth';
import { ADMIN } from '../auth/roles';
import { usePermission } from '../redux/hooks/usePermission';

export const Menu = () => {
	const permission = usePermission();
	const { authType, roles } = permission;
	const authImpl = check(authType);
	const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);

	return (
		<VerticalMenu>
			<Auth roles={[ADMIN]}>
				<MasculineButton action="/concepts/create" />
			</Auth>
			<ExportButton action="/concepts/export" wrapper={false} />
			{adminOrCreator && (
				<PublishButton
					action="/concepts/validation"
					col={8}
					offset={2}
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
