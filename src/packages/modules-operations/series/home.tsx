import { FeminineButton } from '@components/new-button';
import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales';
import { Series } from '../../model/Series';
import OperationsObjectHome from '../../modules-operations/shared/list';
import { useTitle } from '../../utils/hooks/useTitle';

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
