import React, { useState, useEffect } from 'react';
import { PageTitle, Loading } from '@inseefr/wilco';
import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { useTitle, SearchableList, Row } from 'js/utils';
import { HomePageMenu } from './menu';

function CodeListsList() {
	useTitle(D.codelistsTitle, D.codelistsTitle);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.getCodelists()
			.then((codelists) => {
				setItems(codelists);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<div className="container codelists-list">
			<Row>
				<HomePageMenu />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.codelistHomePageTitle} col={12} offset={0} />
					<SearchableList
						items={items}
						childPath="codelists"
						searchUrl="/codelists/search"
						advancedSearch={true}
						label="label"
						autoFocus={true}
						itemFormatter={(_, codelist) => formatLabel(codelist)}
					/>
				</div>
			</Row>
		</div>
	);
}

export default CodeListsList;
