import { Auth } from 'bauhaus-utilities';
import React from 'react';
import { NewButton, VerticalMenu } from '@inseefr/wilco';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.CODELIST_CONTRIBUTOR]}>
				<NewButton action="/codelists/create" wrapper={false} />
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
