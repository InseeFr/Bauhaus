import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';

function SeriesHome({ series }) {
	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-md-8 col-md-offset-2 centered">
						<PageTitle
							title={D.seriesSearchTitle}
							col={12}
							offset={0}
							context="operations"
						/>
						<SearchRmes
							items={series}
							childPath="operations/series"
							context="operations"
						/>
					</div>
				</div>
			</div>
		</div>
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
