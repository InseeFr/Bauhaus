import React from 'react';
import D from 'js/i18n';
import { Auth, useTitle, FeminineButton } from 'bauhaus-utilities';

import OperationsObjectHome from 'js/applications/operations/shared/list';

function SeriesHome({ series }) {
	useTitle(D.operationsTitle, D.seriesTitle);

	return (
		<OperationsObjectHome
			items={series}
			roles={[Auth.ADMIN]}
			title={D.seriesSearchTitle}
			childPath="operations/series"
			searchURL="/operations/series/search"
			createButton={<FeminineButton action="/operations/series/create" />}
		/>
	);
}

export default SeriesHome;
