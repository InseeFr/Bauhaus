import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import { useEffect, useState } from 'react';
import D from '../deprecated-locales';
import { ConceptsApi } from '../sdk';
import { useTitle } from '@utils/hooks/useTitle';
import { Menu } from './menu';

export const Component = () => {
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
						childPath="concepts"
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
