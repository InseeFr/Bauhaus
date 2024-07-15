import D from '../../../i18n';
import { Auth, useTitle } from '../../../utils';
import OperationsObjectHome from '../../../applications/operations/shared/list';
import { FeminineButton } from '../../../new-architecture/components/new-button';

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
