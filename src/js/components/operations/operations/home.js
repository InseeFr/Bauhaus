import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';
import OperationsObjectHome from 'js/components/operations/shared/list';

function OperationsHome({ operations }) {
	return (
		<OperationsObjectHome
			items={operations}
			roles={[ADMIN, SERIES_CREATOR]}
			title={D.operationsSearchTitle}
			childPath="operations/operation"
			createURL="/operations/operation/create"
			advancedSearch={false}
		/>
	);
}

OperationsHome.propTypes = {
	operations: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default OperationsHome;
