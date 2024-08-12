import D from '../../../i18n';
import { Auth } from '../../../utils';

import OperationsObjectHome from '../../../applications/operations/shared/list';
import { FeminineButton } from '../../../new-architecture/components';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';

function SeriesHome({ series }) {
	useTitle(D.operationsTitle, D.seriesTitle);

	return (
		<OperationsObjectHome
			items={series}
			roles={[Auth.ADMIN]}
			title={D.seriesSearchTitle}
			childPath="operations/series"
			searchURL="/operations/series/search"
			createButton={<FeminineButton action="/operations/series/create" />}
		/>
	);
}

export default SeriesHome;
