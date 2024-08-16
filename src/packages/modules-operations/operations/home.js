import D from '../../deprecated-locales';
import OperationsObjectHome from '../../modules-operations/shared/list';
import { FeminineButton } from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { ADMIN, SERIES_CONTRIBUTOR } from '../../auth/roles';

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
