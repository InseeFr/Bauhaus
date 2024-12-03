import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../deprecated-locales';
import { PartialClassification } from '../model/Classification';

type ClassificationsHomeTypes = {
	classifications: PartialClassification[];
};
const ClassificationsHome = ({
	classifications,
}: Readonly<ClassificationsHomeTypes>) => {
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
