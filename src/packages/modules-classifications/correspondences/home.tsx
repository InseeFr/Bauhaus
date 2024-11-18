import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';

const CorrespondencesHome = ({ correspondences }: { correspondences: any }) => {
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
