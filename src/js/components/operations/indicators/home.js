import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';
import check from 'js/utils/auth';
import { Link } from 'react-router-dom';

function IndicatorsHome({ indicators, permission: { authType, roles } }) {
	const authImpl = check(authType);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);
	return (
		<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-md-3 btn-group-vertical">
						{adminOrContributor && (
							<div className="row">
								<div className="col-md-8 col-md-offset-2">
									<Link
										to="/operations/indicator/create"
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
						)}
					</div>
					<div className="col-md-9 centered">
						<PageTitle
							title={D.indicatorsSearchTitle}
							col={12}
							offset={0}
							context="operations"
						/>
						<SearchRmes
							items={indicators}
							childPath="operations/indicator"
							context="operations"
							label="label"
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

IndicatorsHome.propTypes = {
	indicators: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default IndicatorsHome;
