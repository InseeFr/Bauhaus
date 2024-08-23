import { ExportButton, PublishButton, VerticalMenu } from '@inseefr/wilco';
import check from '../auth/auth';
import { MasculineButton } from '../components';
import { ADMIN } from '../auth/roles';
import Auth from '../auth/components/auth';
import { usePermission } from '../redux/hooks/usePermission';

export const Menu = () => {
	const permission = usePermission();
	const { authType, roles } = permission;
	const authImpl = check(authType);
	const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);

	return (
		<VerticalMenu>
			<Auth roles={[ADMIN]}>
				<MasculineButton action="/concept/create" />
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
