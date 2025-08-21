import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';
import { PartialClassificationSerie } from '@model/Classification';

const SeriesHome = ({
	series,
}: Readonly<{ series: PartialClassificationSerie[] | undefined }>) => {
	useTitle(D.classificationsTitle, D.seriesTitle);

	if (!series) {
		return null;
	}

	return (
		<div className="container">
			<Row>
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.seriesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={series}
						childPath="classifications/series"
						autoFocus
					/>
				</div>
			</Row>
		</div>
	);
};

export default SeriesHome;
