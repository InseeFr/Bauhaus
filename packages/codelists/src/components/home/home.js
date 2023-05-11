import React, { useState, useEffect } from 'react';
import {
	NewButton,
	PageTitle,
	VerticalMenu,
	Loading,
} from '@inseefr/wilco';
import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { useTitle, SearchableList, Auth } from 'bauhaus-utilities';

function CodeListsList() {
	useTitle(D.codelistsTitle, D.codelistsTitle)
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
			<div className="row">
				<VerticalMenu>
					<Auth.AuthGuard roles={[Auth.ADMIN]}>
						<NewButton action="/codelists/create" wrapper={false} />
					</Auth.AuthGuard>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.codelistTitle} col={12} offset={0} />
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
			</div>
		</div>
	);
}

export default CodeListsList;
