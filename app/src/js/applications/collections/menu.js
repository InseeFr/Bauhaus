import { Auth, FeminineButton } from 'bauhaus-utilities';
import React from 'react';
import D from '../../i18n/build-dictionary';
import check from '../../utils/auth';
import { Button, VerticalMenu, ExportButton } from '@inseefr/wilco';
import { useSelector } from 'react-redux';

export const Menu = () => {
	const { authType, roles } = useSelector((state) => Auth.getPermission(state));

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
						<React.Fragment>
							<span className="glyphicon glyphicon-ok" aria-hidden="true" />
							<span> {D.btnValid}</span>
						</React.Fragment>
					}
					action="/collections/validation"
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
