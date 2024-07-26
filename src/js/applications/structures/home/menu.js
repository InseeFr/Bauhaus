import { Auth } from '../../../utils';
import { ExportButton, ImportButton, VerticalMenu } from '@inseefr/wilco';
import D from '../../../i18n/build-dictionary';
import { getEnvVar } from '../../../new-architecture/utils/env';
import { FeminineButton } from '../../../new-architecture/components/new-button';

export const HomePageMenu = () => {
	const isLocal = getEnvVar('API_MODE') === 'local';

	return (
		<VerticalMenu>
			<Auth.AuthGuard roles={[Auth.ADMIN, Auth.STRUCTURE_CONTRIBUTOR]}>
				<FeminineButton action="/structures/create" />
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
