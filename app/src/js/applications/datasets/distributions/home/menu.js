import { Auth, FeminineButton } from 'bauhaus-utilities';
import { VerticalMenu } from '@inseefr/wilco';
import React from 'react';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<FeminineButton
					action="/datasets/distributions/create"
				/>
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
