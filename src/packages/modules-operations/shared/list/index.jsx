import { Button, VerticalMenu } from '@inseefr/wilco';
import { PageTitle, SearchableList } from '../../../components';

import D from '../../../deprecated-locales';
import Auth from '../../../auth/components/auth';

function OperationsObjectHome({
	items,
	roles,
	title,
	childPath,
	searchURL,
	advancedSearch = true,
	createButton,
}) {
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					<Auth roles={roles}>{createButton}</Auth>
					<Button wrapper={false} action="/operations/tree">
						{D.btnTree}
					</Button>
				</VerticalMenu>
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
