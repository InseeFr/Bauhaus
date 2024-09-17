import { PageTitle, Row, SearchableList } from '../components';
import D from '../deprecated-locales';
import { useTitle } from '../utils/hooks/useTitle';

const ClassificationsHome = ({ classifications }) => {
	useTitle(D.classificationsTitle, D.classificationsTitle);

	return (
		<div className="container">
			<Row>
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.classificationsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={classifications}
						childPath="classifications/classification"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default ClassificationsHome;
