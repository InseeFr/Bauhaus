import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';

function FamiliesHome({ families }) {
	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-md-8 col-md-offset-2 centered">
						<PageTitle
							title={D.familiesSearchTitle}
							col={12}
							offset={0}
							context="operations"
						/>
						<SearchRmes
							items={families}
							childPath="operations/family"
							context="operations"
							label="prefLabelLg1"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

FamiliesHome.propTypes = {
	families: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			prefLabelLg1: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default FamiliesHome;
