import Auth from '../../auth/components/auth';
import { ExportButton, ImportButton, VerticalMenu } from '@inseefr/wilco';
import D from '../../deprecated-locales/build-dictionary';
import { getEnvVar } from '../../utils/env';
import { FeminineButton } from '../../components';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../auth/roles';

export const HomePageMenu = () => {
	const isLocal = getEnvVar('API_MODE') === 'local';

	return (
		<VerticalMenu>
			<Auth roles={[ADMIN, STRUCTURE_CONTRIBUTOR]}>
				<FeminineButton action="/structures/create" />
			</Auth>
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
