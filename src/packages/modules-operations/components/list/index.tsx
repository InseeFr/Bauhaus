import { ReactNode } from 'react';

import { Button } from '@components/buttons/button';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import { VerticalMenu } from '@components/vertical-menu';

import Auth, { RoleChecks } from '../../../auth/components/auth';
import D from '../../../deprecated-locales';

interface OperationsObjectHomeTypes {
	items: any[];
	roles: RoleChecks;
	title: string;
	childPath: string;
	searchURL: string;
	advancedSearch?: boolean;
	createButton: ReactNode;
}
function OperationsObjectHome({
	items,
	roles,
	title,
	childPath,
	searchURL,
	advancedSearch = true,
	createButton,
}: Readonly<OperationsObjectHomeTypes>) {
	return (
		<div className="container">
			<Row>
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
						advancedSearch={advancedSearch}
						searchUrl={searchURL}
						autoFocus
					/>
				</div>
			</Row>
		</div>
	);
}

export default OperationsObjectHome;
