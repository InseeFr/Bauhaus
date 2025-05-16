import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';

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
						autoFocus
					/>
				</div>
			</Row>
		</div>
	);
};

export default FamiliesHome;
