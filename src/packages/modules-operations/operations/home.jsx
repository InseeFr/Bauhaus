import { FeminineButton } from '@components/new-button';

import { useTitle } from '@utils/hooks/useTitle';

import { ADMIN, SERIES_CONTRIBUTOR } from '../../auth/roles';
import D from '../../deprecated-locales';
import OperationsObjectHome from '../components/list';

function OperationsHome({ operations }) {
	useTitle(D.operationsTitle, D.operationsTitle);

	return (
		<OperationsObjectHome
			items={operations}
			roles={[ADMIN, SERIES_CONTRIBUTOR]}
			title={D.operationsSearchTitle}
			childPath="operations/operation"
			advancedSearch={false}
			createButton={<FeminineButton action="/operations/operation/create" />}
		/>
	);
}

export default OperationsHome;
