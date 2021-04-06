import React, { useState, useEffect } from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	VerticalMenu,
	Loading,
} from '@inseefr/wilco';
import { CodesList } from 'bauhaus-utilities';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';

function CodeListsList() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	//	const filteredItems = items.map(({ id, labelLg1, labelLg2 }) => ({ id, labelLg1 , labelLg2 }) );

	useEffect(() => {
		CodesList.getCodesLists()
			.then((codelists) => {
				setItems(codelists);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<div className="container codelists-components-list">
			<div className="row">
				<VerticalMenu>
					<NewButton action="/codelists/components/create" wrapper={false} />
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.componentTitle} col={12} offset={0} />
					<SearchableList
						items={items}
						childPath="codelists/components"
						searchUrl="/codelists/components/search"
						advancedSearch={true}
						label="label"
						autoFocus={true}
						itemFormatter={(_, component) => formatLabel(component)}
					/>
				</div>
			</div>
		</div>
	);
}

export default CodeListsList;
