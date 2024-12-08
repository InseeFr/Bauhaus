import {
	ExportButton,
	ImportButton,
} from '@components/buttons/buttons-with-icons';
import { FeminineButton } from '@components/new-button';
import { VerticalMenu } from '@components/vertical-menu';

import Auth from '../../auth/components/auth';
import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../auth/roles';
import D from '../../deprecated-locales/build-dictionary';

export const DumbHomePageMenu = ({
	isLocal,
}: Readonly<{ isLocal: boolean }>) => {
	return (
		<VerticalMenu>
			<Auth roles={[ADMIN, STRUCTURE_CONTRIBUTOR]}>
				<FeminineButton action="/structures/create" />
			</Auth>
			{isLocal && (
				<ImportButton
					label={D.btnImport}
					action="/structures/import"
					wrapper={false}
				/>
			)}
			{isLocal && <ExportButton action="/structures/export" wrapper={false} />}
		</VerticalMenu>
	);
};

export const HomePageMenu = () => {
	const isLocal = import.meta.env.VITE_API_MODE === 'local';
	return <DumbHomePageMenu isLocal={isLocal} />;
};
