import { Auth } from 'bauhaus-utilities';
import React from 'react';
import { NewButton, VerticalMenu } from '@inseefr/wilco';
export const HomePageMenu = ({ filter }) => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<NewButton
					action={
						'/structures/components/create?type=' + encodeURIComponent(filter)
					}
					wrapper={false}
				/>
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
