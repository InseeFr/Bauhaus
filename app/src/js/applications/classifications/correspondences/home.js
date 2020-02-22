import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle, SearchableList } from '@inseefr/wilco';
import D from 'js/i18n';

const CorrespondencesHome = ({ correspondences }) => {
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 centered">
					<PageTitle title={D.correspondencesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={correspondences}
						childPath="classifications/correspondence"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
};

CorrespondencesHome.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default CorrespondencesHome;
