import React from 'react';
import PageTitle from 'js/components/shared/page-title';
import SearchRmes from 'js/components/shared/search-rmes/search-rmes';
import D from 'js/i18n';
import { Link } from 'react-router-dom';
import Auth from 'js/utils/auth/components/auth';

function OperationsObjectHome({
	items,
	roles,
	title,
	childPath,
	searchURL,
	createURL,
	advancedSearch = true,
}) {
	return (
		<>
			<div className="container">
				<div className="row">
					<Auth roles={roles}>
						<div className="col-md-3 operations-btn-group-vertical">
							<div className="row">
								<div className="col-md-8 col-md-offset-2">
									<Link
										to={createURL}
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
					<div className="col-md-8 centered pull-right operations-list">
						<PageTitle title={title} col={12} offset={0} />
						<SearchRmes
							items={items}
							childPath={childPath}
							label="label"
							searchUrl={searchURL}
							advancedSearch={advancedSearch}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default OperationsObjectHome;
