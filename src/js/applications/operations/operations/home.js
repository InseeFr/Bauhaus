import D from '../../../i18n';
import { Auth } from '../../../utils';
import OperationsObjectHome from '../../../applications/operations/shared/list';
import { FeminineButton } from '../../../new-architecture/components';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';

function OperationsHome({ operations }) {
	useTitle(D.operationsTitle, D.operationsTitle);

	return (
		<OperationsObjectHome
			items={operations}
			roles={[Auth.ADMIN, Auth.SERIES_CONTRIBUTOR]}
			title={D.operationsSearchTitle}
			childPath="operations/operation"
			advancedSearch={false}
			createButton={<FeminineButton action="/operations/operation/create" />}
		/>
	);
}

export default OperationsHome;
