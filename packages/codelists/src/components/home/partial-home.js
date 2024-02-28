import React, { useState, useEffect } from 'react';
import { PageTitle, VerticalMenu, Loading } from '@inseefr/wilco';
import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import {
	useTitle,
	SearchableList,
	Auth,
	FeminineButton,
} from 'bauhaus-utilities';

function CodeListsPartialHome() {
	useTitle(D.codelistsPartialTitle, D.codelistsPartialTitle);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.getCodelistsPartial()
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
						<FeminineButton action="/codelists-partial/create" />
					</Auth.AuthGuard>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle
						title={D.codelistPartialHomePageTitle}
						col={12}
						offset={0}
					/>
					<SearchableList
						items={items}
						childPath="codelists-partial"
						searchUrl="/codelists-partial/search"
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

export default CodeListsPartialHome;
