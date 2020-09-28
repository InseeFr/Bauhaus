import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { Auth } from 'bauhaus-utilities';
import OperationsObjectHome from 'js/applications/operations/shared/list';

function FamiliesHome({ families }) {
	return (
		<OperationsObjectHome
			items={families}
			roles={[Auth.ADMIN]}
			title={D.familiesSearchTitle}
			childPath="operations/family"
			searchURL="/operations/families/search"
			createURL="/operations/family/create"
		/>
	);
}

FamiliesHome.propTypes = {
	families: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default FamiliesHome;
