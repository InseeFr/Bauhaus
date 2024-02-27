import React from 'react';
import PropTypes from 'prop-types';
import D from 'js/i18n';
import { Auth, useTitle, FeminineButton } from 'bauhaus-utilities';
import OperationsObjectHome from 'js/applications/operations/shared/list';

function OperationsHome({ operations }) {
	useTitle(D.operationsTitle, D.operationsTitle)

	return (
		<OperationsObjectHome
			items={operations}
			roles={[Auth.ADMIN, Auth.SERIES_CONTRIBUTOR]}
			title={D.operationsSearchTitle}
			childPath="operations/operation"
			advancedSearch={false}
			createButton={<FeminineButton action="/operations/operation/create" />}
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
