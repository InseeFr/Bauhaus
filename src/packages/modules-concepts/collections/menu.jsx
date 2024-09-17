import D from '../../deprecated-locales/build-dictionary';
import check from '../../auth/auth';
import { Button, VerticalMenu, ExportButton } from '@inseefr/wilco';
import { FeminineButton } from '../../components';
import { usePermission } from '../../redux/hooks/usePermission';

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
				<Button
					label={
						<>
							<span className="glyphicon glyphicon-ok" aria-hidden="true" />
							<span> {D.btnValid}</span>
						</>
					}
					action="/collections/validation"
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
