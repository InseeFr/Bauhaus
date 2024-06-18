import { Auth, MasculineButton } from 'bauhaus-utilities';
import { ExportButton, PublishButton, VerticalMenu } from '@inseefr/wilco';
import React from 'react';
import { useSelector } from 'react-redux';
import check from '../../utils/auth';

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
