import React from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	Button,
	VerticalMenu,
} from '@inseefr/wilco';
import { Auth } from 'bauhaus-utilities';
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
				<Auth.AuthGuard roles={roles}>
					<VerticalMenu>
						<NewButton action={createURL} wrapper={false} />
						<Button wrapper={false} action="/operations/tree">
							{D.btnTree}
						</Button>
					</VerticalMenu>
				</Auth.AuthGuard>
				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={title} col={12} offset={0} />
					<SearchableList
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
