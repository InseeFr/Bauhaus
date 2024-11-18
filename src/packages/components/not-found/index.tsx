import { PageTitle } from '@components/page-title';

import { createAllDictionary } from '../../utils/dictionnary';

const { D } = createAllDictionary({
	notFoundTitle: {
		fr: 'Page introuvable',
		en: 'Page not found',
	},
	underMaintenanceTitle: {
		fr: 'En maintenance',
		en: 'Under maintenance',
	},
});

export const NotFound = ({ label = D.notFoundTitle }) => (
	<div className="container not-found">
		<PageTitle title={label} />
	</div>
);

export const UnderMaintenance = () => (
	<NotFound label={D.underMaintenanceTitle} />
);
