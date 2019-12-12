import React from 'react';
import { NewButton, SearchRmes, PageTitle, Button } from 'bauhaus-library';
import Auth from 'js/utils/auth/components/auth';
import D from 'js/i18n';

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
		<div className="container">
			<div className="row">
				<Auth roles={roles}>
					<div className="col-md-3 btn-group-vertical">
						<div className="row">
							<div className="col-md-12">
								<NewButton action={createURL} wrapper={false} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<Button wrapper={false} action="/operations/tree">
									{D.btnTree}
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
	);
}

export default OperationsObjectHome;
