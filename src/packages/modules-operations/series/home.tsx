import { FeminineButton } from '@components/new-button';

import { useTitle } from '@utils/hooks/useTitle';

import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales';
import { Series } from '../../model/Series';
import OperationsObjectHome from '../shared/list';

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
