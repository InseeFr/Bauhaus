import check from '../../auth/auth';
import { FeminineButton } from '../../components';
import { usePermission } from '../../redux/hooks/usePermission';
import { VerticalMenu } from '../../components/vertical-menu';
import {
	ExportButton,
	PublishButton,
} from '../../components/buttons/buttons-with-icons';

export const Menu = () => {
	const { authType, roles } = usePermission();

	const authImpl = check(authType);
	const adminOrCreator = authImpl.isAdminOrCollectionCreator(roles);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);

	return (
		<VerticalMenu>
			{adminOrContributor && <FeminineButton action="/collection/create" />}
			<ExportButton action="/collections/export" wrapper={false} />
			{adminOrCreator && (
				<PublishButton
					action="/collections/validation"
					col={8}
					offset={2}
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
