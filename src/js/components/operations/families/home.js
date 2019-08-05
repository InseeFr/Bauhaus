import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { ADMIN } from 'js/utils/auth/roles';
import OperationsObjectHome from 'js/components/operations/shared/list';

function FamiliesHome({ families }) {
	return (
		<OperationsObjectHome
			items={families}
			roles={[ADMIN]}
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
