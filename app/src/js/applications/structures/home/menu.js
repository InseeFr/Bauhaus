import { Auth } from 'bauhaus-utilities';
import {
	ExportButton,
	ImportButton,
	NewButton,
	VerticalMenu,
} from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';
import React from 'react';
import { getEnvVar } from '../../../utils/env';

export const HomePageMenu = () => {
	const isLocal = getEnvVar('API_MODE') === 'local';

	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<NewButton
					label={D.btnNewFemale}
					action="/structures/create"
					col={8}
					offset={2}
					wrapper={false}
				/>
			</Auth.AuthGuard>
			{isLocal && (
				<ImportButton
					label={D.btnImport}
					action="/structures/import"
					col={8}
					offset={2}
					wrapper={false}
				/>
			)}
			{isLocal && (
				<ExportButton
					action="/structures/export"
					col={8}
					offset={2}
					wrapper={false}
				/>
			)}
		</VerticalMenu>
	);
};
