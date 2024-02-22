import { Auth } from 'bauhaus-utilities';
import { NewButton, VerticalMenu } from '@inseefr/wilco';
import React from 'react';
import D from '../../../../i18n/build-dictionary';

export const HomePageMenu = () => {
	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.DATASET_CONTRIBUTOR]}>
				<NewButton
					label={D.btnNewFemale}
					action="/datasets/distributions/create"
					col={8}
					offset={2}
					wrapper={false}
				/>
			</Auth.AuthGuard>
		</VerticalMenu>
	);
};
