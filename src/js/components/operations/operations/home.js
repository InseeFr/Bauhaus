import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes/search-rmes';
import D from 'js/i18n';
import { Link } from 'react-router-dom';
import { ADMIN, SERIES_CREATOR } from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';

function OperationsHome({ operations }) {
	return (
		<>
			<div className="container">
				<div className="row">
					<Auth roles={[ADMIN, SERIES_CREATOR]}>
						<div className="col-md-3 operations-btn-group-vertical">
							<div className="row">
								<div className="col-md-8 col-md-offset-2">
									<Link
										to="/operations/operation/create"
										col={8}
										offset={2}
										className="btn btn-operations btn-lg col-md-12"
									>
										<span
											className="glyphicon glyphicon-plus"
											aria-hidden="true"
										/>
										<span> {D.btnNewMale}</span>
									</Link>
								</div>
							</div>
						</div>
					</Auth>
					<div className="col-md-8 centered pull-right">
						<PageTitle title={D.operationsSearchTitle} col={12} offset={0} />
						<SearchRmes
							items={operations}
							childPath="operations/operation"
							label="label"
							advancedSearch
							searchUrl="/operations/search"
						/>
					</div>
				</div>
			</div>
		</>
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
