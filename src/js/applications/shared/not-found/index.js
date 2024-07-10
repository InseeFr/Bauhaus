import { PageTitle } from 'js/new-architecture/components';
import D from 'js/i18n';

const NotFound = ({ label = D.notFoundTitle }) => (
	<div className="container not-found">
		<PageTitle title={label} />
	</div>
);

export const UnderMaintenance = () => (
	<NotFound label={D.underMaintenanceTitle} />
);

export default NotFound;
