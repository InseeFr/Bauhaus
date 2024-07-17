import { ExportButton, PublishButton, VerticalMenu } from '@inseefr/wilco';
import { useSelector } from 'react-redux';
import check from '../../utils/auth';
import { Auth } from '../../utils';
import { MasculineButton } from '../../new-architecture/components/new-button';

export const Menu = () => {
	const permission = useSelector((state) => Auth.getPermission(state));
	const { authType, roles } = permission;
	const authImpl = check(authType);
	const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);

	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<MasculineButton action="/concept/create" />
			</Auth.AuthGuard>
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
