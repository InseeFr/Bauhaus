import D from '../../deprecated-locales';

import OperationsObjectHome from '../../modules-operations/shared/list';
import { FeminineButton } from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { ADMIN } from '../../auth/roles';
import { Series } from '../../model/Series';

function SeriesHome({ series }: Readonly<{ series: Series[] }>) {
	useTitle(D.operationsTitle, D.seriesTitle);

	return (
		<OperationsObjectHome
			items={series}
			roles={[ADMIN]}
			title={D.seriesSearchTitle}
			childPath="operations/series"
			searchURL="/operations/series/search"
			createButton={<FeminineButton action="/operations/series/create" />}
		/>
	);
}

export default SeriesHome;
