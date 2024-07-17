import D from '../../../i18n';
import { useTitle, SearchableList } from '../../../utils';
import { PageTitle, Row } from '../../../new-architecture/components';

const SeriesHome = ({ series }) => {
	useTitle(D.classificationsTitle, D.seriesTitle);

	return (
		<div className="container">
			<Row>
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.seriesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={series}
						childPath="classifications/series"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default SeriesHome;
