import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';

function OperationsHome({ operations }) {
	return (
		<div>
			<div className="container">
				<div className="row">
					<div className="col-md-8 col-md-offset-2 centered">
						<PageTitle
							title={D.operationsSearchTitle}
							col={12}
							offset={0}
							context="operations"
						/>
						<SearchRmes
							items={operations}
							childPath="operations/operation"
							context="operations"
							label="label"
						/>
					</div>
				</div>
			</div>
		</div>
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
