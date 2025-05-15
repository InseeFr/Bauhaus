import { Button } from '@components/buttons/button';
import { Row } from '@components/layout';
import { FeminineButton } from '@components/new-button';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import { VerticalMenu } from '@components/vertical-menu';

import { useTitle } from '@utils/hooks/useTitle';

import { HasAccess } from '../../auth/components/auth';
import D from '../../deprecated-locales';

function OperationsHome({ operations }) {
	useTitle(D.operationsTitle, D.operationsTitle);

	return (
		<div className="container">
			<Row>
				<VerticalMenu>
					<HasAccess module="OPERATION_OPERATION" privilege="CREATE">
						<FeminineButton action="/operations/operation/create" />
					</HasAccess>
					<Button wrapper={false} action="/operations/tree">
						{D.btnTree}
					</Button>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.operationsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={operations}
						childPath={'operations/operation'}
						label="label"
						advancedSearch={false}
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
}

export default OperationsHome;
