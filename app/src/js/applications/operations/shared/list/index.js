import React from 'react';
import {
	NewButton,
	SearchRmes,
	PageTitle,
	Button,
	VerticalMenu,
} from 'bauhaus-library';
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
					<VerticalMenu>
						<NewButton action={createURL} wrapper={false} />
						<Button wrapper={false} action="/operations/tree">
							{D.btnTree}
						</Button>
					</VerticalMenu>
				</Auth>
				<div className="col-md-8 centered pull-right operations-list">
					<PageTitle title={title} col={12} offset={0} />
					<SearchRmes
						items={items}
						childPath={childPath}
						label="label"
						searchUrl={searchURL}
						advancedSearch={advancedSearch}
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
}

export default OperationsObjectHome;
