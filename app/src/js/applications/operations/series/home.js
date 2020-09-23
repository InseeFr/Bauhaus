import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { Auth } from 'bauhaus-utilities';

import OperationsObjectHome from 'js/applications/operations/shared/list';

function SeriesHome({ series }) {
	return (
		<OperationsObjectHome
			items={series}
			roles={[Auth.ADMIN]}
			title={D.seriesSearchTitle}
			childPath="operations/series"
			searchURL="/operations/series/search"
			createURL="/operations/series/create"
		/>
	);
}

SeriesHome.propTypes = {
	series: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default SeriesHome;
