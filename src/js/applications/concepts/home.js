import { useEffect, useState } from 'react';
import {
	PageTitle,
	Loading,
	Row,
	SearchableList,
} from '../../new-architecture/components';
import D from '../../i18n';
import { ConceptsApi } from '../../new-architecture/sdk';
import { Menu } from './menu';
import { useTitle } from '../../new-architecture/utils/hooks/useTitle';

const ConceptsHome = () => {
	useTitle(D.conceptsTitle, D.conceptsTitle);
	const [concepts, setConcepts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		ConceptsApi.getConceptList()
			.then(setConcepts)
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<Row>
				<Menu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.conceptSearchTitle} col={12} offset={0} />
					<SearchableList
						items={concepts}
						childPath="concept"
						advancedSearch
						searchUrl="/concepts/search"
						placeholder={D.searchLabelHomePlaceholder}
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};

export default ConceptsHome;
