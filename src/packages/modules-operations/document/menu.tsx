import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../auth/roles';
import D from '../../deprecated-locales/build-dictionary';
import { MasculineButton } from '../../components';
import Auth from '../../auth/components/auth';
import { VerticalMenu } from '../../components/vertical-menu';

const routes = [
	['/operations/document/create', D.document],
	['/operations/link/create', D.link],
];
export const Menu = () => {
	return (
		<Auth roles={[ADMIN, INDICATOR_CONTRIBUTOR, SERIES_CONTRIBUTOR]}>
			<VerticalMenu>
				{routes.map(([url, title]) => (
					<MasculineButton key={title} action={url} suffix={title} />
				))}
			</VerticalMenu>
		</Auth>
	);
};
