import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle } from '@inseefr/wilco';
import D from 'js/i18n';
import { useTitle, SearchableList } from 'bauhaus-utilities';

const SeriesHome = ({ series }) => {
	useTitle(D.classificationsTitle, D.seriesTitle);

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.seriesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={series}
						childPath="classifications/series"
						autoFocus={true}
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
