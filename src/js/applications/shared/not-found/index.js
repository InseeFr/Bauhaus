import { PageTitle } from '../../../new-architecture/components';
import D from '../../../i18n';

export const NotFound = ({ label = D.notFoundTitle }) => (
	<div className="container not-found">
		<PageTitle title={label} />
	</div>
);

export const UnderMaintenance = () => (
	<NotFound label={D.underMaintenanceTitle} />
);
