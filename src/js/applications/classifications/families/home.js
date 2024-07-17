import { PageTitle, Row } from '../../../new-architecture/components';
import D from '../../../i18n';
import { useTitle, SearchableList } from '../../../utils';

const FamiliesHome = ({ families }) => {
	useTitle(D.classificationsTitle, D.familiesTitle);
	return (
		<div className="container">
			<Row>
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.familiesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={families}
						childPath="classifications/family"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default FamiliesHome;
