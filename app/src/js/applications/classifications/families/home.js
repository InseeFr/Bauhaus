import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle, SearchRmes } from 'bauhaus-library';
import D from 'js/i18n';

const FamiliesHome = ({ families }) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 centered">
					<PageTitle title={D.familiesSearchTitle} col={12} offset={0} />
					<SearchRmes
						items={families}
						childPath="classifications/family"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
};

FamiliesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default FamiliesHome;
