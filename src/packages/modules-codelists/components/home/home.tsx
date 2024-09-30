// @ts-ignore
import { useState, useEffect } from 'react';
import { Loading, PageTitle, Row, SearchableList } from '../../../components/';

import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { HomePageMenu } from './menu';
import { useTitle } from '../../../utils/hooks/useTitle';

export const Component = () => {
	useTitle(D.codelistsTitle, D.codelistsTitle);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.getCodelists()
			.then((codelists: any) => {
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
						itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
					/>
				</div>
			</Row>
		</div>
	);
};
