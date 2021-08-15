import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle, SearchableList } from '@inseefr/wilco';
import D from 'js/i18n';
import { useTitle } from 'bauhaus-utilities';

const FamiliesHome = ({ families }) => {
	useTitle(D.classificationsTitle, D.familiesTitle);
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.familiesSearchTitle} col={12} offset={0} />
					<SearchableList
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
