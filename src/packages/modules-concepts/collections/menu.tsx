import {
	ExportButton,
	PublishButton,
} from '@components/buttons/buttons-with-icons';
import { FeminineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import check from '../../auth/auth';
import { usePermission } from '../../redux/hooks/usePermission';

export const Menu = () => {
	const { roles } = usePermission();

	const authImpl = check();
	const adminOrCreator = authImpl.isAdminOrCollectionCreator(roles);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);

	return (
		<VerticalMenu>
			{adminOrContributor && (
				<FeminineButton action="/concepts/collections/create" />
			)}
			<ExportButton action="/concepts/collections/export" wrapper={false} />
			{adminOrCreator && (
				<PublishButton
					action="/concepts/collections/validation"
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
