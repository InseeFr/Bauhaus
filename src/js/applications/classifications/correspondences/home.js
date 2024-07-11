import { PageTitle, Row } from 'js/new-architecture/components';
import D from 'js/i18n';
import { useTitle, SearchableList } from 'js/utils';

const CorrespondencesHome = ({ correspondences }) => {
	useTitle(D.classificationsTitle, D.correspondencesTitle);
	return (
		<div className="container">
			<Row>
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.correspondencesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={correspondences}
						childPath="classifications/correspondence"
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default CorrespondencesHome;
