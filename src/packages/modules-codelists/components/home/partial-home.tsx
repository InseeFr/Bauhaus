import { useState, useEffect } from 'react';
import {
	PageTitle,
	Loading,
	Row,
	FeminineButton,
	SearchableList,
} from '../../../components';

import { API } from '../../apis';
import { formatLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { useTitle } from '../../../utils/hooks/useTitle';
import Auth from '../../../auth/components/auth';
import { ADMIN } from '../../../auth/roles';
import { VerticalMenu } from '../../../components/vertical-menu';

function CodeListsPartialHome() {
	useTitle(D.codelistsTitle, D.codelistsPartialTitle);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		API.getCodelistsPartial()
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
				<VerticalMenu>
					<Auth roles={[ADMIN]}>
						<FeminineButton action="/codelists/partial/create" />
					</Auth>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle
						title={D.codelistPartialHomePageTitle}
						col={12}
						offset={0}
					/>
					<SearchableList
						items={items}
						childPath="codelists/partial"
						searchUrl="/codelists/partial/search"
						advancedSearch={true}
						label="label"
						autoFocus={true}
						itemFormatter={(_: any, codelist: any) => formatLabel(codelist)}
					/>
				</div>
			</Row>
		</div>
	);
}

export default CodeListsPartialHome;
