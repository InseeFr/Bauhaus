import React, { useEffect, useState } from 'react';
import { PageTitle, Loading } from '@inseefr/wilco';
import D from 'js/i18n';
import { ArrayUtils, SearchableList, useTitle } from 'bauhaus-utilities';
import api from '../../remote-api/concepts-api';
import { Menu } from './menu';

const ConceptsHome = () => {
	useTitle(D.conceptsTitle, D.conceptsTitle);
	const [concepts, setConcepts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.getConceptList()
			.then((body) => {
				setConcepts(ArrayUtils.sortArrayByLabel(body));
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="row">
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
			</div>
		</div>
	);
};

export default ConceptsHome;
