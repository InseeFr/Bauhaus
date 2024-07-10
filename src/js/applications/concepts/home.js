import { useEffect, useState } from 'react';
import { PageTitle, Loading } from 'js/new-architecture/components';
import D from 'js/i18n';
import api from '../../remote-api/concepts-api';
import { Menu } from './menu';
import { Row, SearchableList, useTitle } from '../../utils';

const ConceptsHome = () => {
	useTitle(D.conceptsTitle, D.conceptsTitle);
	const [concepts, setConcepts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.getConceptList()
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
