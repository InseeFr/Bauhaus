import D from '../../deprecated-locales/build-dictionary';
import check from '../../auth/auth';
import { FeminineButton } from '../../components';
import { usePermission } from '../../redux/hooks/usePermission';
import { VerticalMenu } from '../../components/vertical-menu';
import { ExportButton } from '../../components/buttons/buttons-with-icons';
import { Button } from '../../components/buttons/button';

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
