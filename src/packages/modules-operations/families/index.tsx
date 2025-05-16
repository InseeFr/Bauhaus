import { useLoaderData } from 'react-router-dom';

import { FeminineButton } from '@components/new-button';

import { useTitle } from '@utils/hooks/useTitle';

import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales/build-dictionary';
import { FamilyHome } from '../../model/operations/family';
import OperationsObjectHome from '../components/list';

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
