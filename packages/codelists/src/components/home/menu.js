import { Auth, FeminineButton } from 'bauhaus-utilities';
import React from 'react';
import { VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<FeminineButton action="/codelists/create" />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
