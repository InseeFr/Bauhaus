import { PageTitle } from 'js/new-architecture/components';
import D from 'js/i18n';
import { useTitle, SearchableList } from 'js/utils';
import { Row } from 'js/new-architecture/components';

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
