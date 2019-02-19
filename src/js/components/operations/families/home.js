import React from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';
import { Link } from 'react-router-dom';

function FamiliesHome({ families }) {
	return (
		<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-md-3 btn-group-vertical">
						<div className="row">
							<div className="col-md-8 col-md-offset-2">
								<Link
									to="/operations/family/create"
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
					<div className="col-md-8 centered pull-right">
						<PageTitle
							title={D.familiesSearchTitle}
							col={12}
							offset={0}
							context="operations"
						/>
						<SearchRmes
							items={families}
							childPath="operations/family"
							context="operations"
							label="label"
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
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
