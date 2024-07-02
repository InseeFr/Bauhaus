import { useState, useEffect } from 'react';
import { PageTitle, VerticalMenu, Loading } from '@inseefr/wilco';
import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { useTitle, SearchableList, Auth, FeminineButton, Row } from 'js/utils';

function CodeListsPartialHome() {
	useTitle(D.codelistsTitle, D.codelistsPartialTitle);
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
			<Row>
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
			</Row>
		</div>
	);
}

export default CodeListsPartialHome;
