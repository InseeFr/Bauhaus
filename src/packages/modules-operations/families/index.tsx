import { useLoaderData } from 'react-router-dom';

import { Button } from '@components/buttons/button';
import { Row } from '@components/layout';
import { FeminineButton } from '@components/new-button';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';
import { VerticalMenu } from '@components/vertical-menu';

import { useTitle } from '@utils/hooks/useTitle';

import { HasAccess } from '../../auth/components/auth';
import D from '../../deprecated-locales/build-dictionary';
import { FamilyHome } from '../../model/operations/family';

export const Component = () => {
	const families = useLoaderData() as FamilyHome[];
	useTitle(D.operationsTitle, D.familiesTitle);

	return (
		<div className="container">
			<Row>
				<VerticalMenu>
					<HasAccess module="OPERATION_FAMILY" privilege="CREATE">
						<FeminineButton action="/operations/families/create" />
					</HasAccess>
					<Button wrapper={false} action="/operations/tree">
						{D.btnTree}
					</Button>
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.familiesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={families}
						childPath="operations/family"
						label="label"
						searchUrl="/operations/families/search"
						advancedSearch={true}
						autoFocus={true}
					/>
				</div>
			</Row>
		</div>
	);
};
