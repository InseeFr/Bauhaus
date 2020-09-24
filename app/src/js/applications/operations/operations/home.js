import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { Auth } from 'bauhaus-utilities';
import OperationsObjectHome from 'js/applications/operations/shared/list';

function OperationsHome({ operations }) {
	return (
		<OperationsObjectHome
			items={operations}
			roles={[Auth.ADMIN, Auth.SERIES_CONTRIBUTOR]}
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
