import React from 'react';
import { PageTitle } from 'bauhaus-library';
import { SearchRmes } from 'bauhaus-library';
import D from 'js/i18n';
import { Button } from 'bauhaus-library';
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
						<div className="col-md-3 btn-group-vertical">
							<div className="row">
								<div className="col-md-8 col-md-offset-2">
									<Button action={createURL} wrapper={false}>
										<span
											className="glyphicon glyphicon-plus"
											aria-hidden="true"
										/>
										<span> {D.btnNewMale}</span>
									</Button>
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
