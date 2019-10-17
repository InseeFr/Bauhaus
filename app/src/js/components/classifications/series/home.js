import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle } from 'bauhaus-library';
import { SearchRmes } from 'bauhaus-library';
import D from 'js/i18n';

const SeriesHome = ({ series }) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 centered">
					<PageTitle
						title={D.seriesSearchTitle}
						col={12}
						offset={0}
						context="classifications"
					/>
					<SearchRmes
						items={series}
						childPath="classifications/series"
						context="classifications"
					/>
				</div>
			</div>
		</div>
	);
};

SeriesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default SeriesHome;
