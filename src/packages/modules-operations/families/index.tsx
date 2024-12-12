import { useLoaderData } from 'react-router-dom';

import { FeminineButton } from '@components/new-button';

import { useTitle } from '@utils/hooks/useTitle';

import { ADMIN } from '../../auth/roles';
import D from '../../deprecated-locales/build-dictionary';
import { FamilyHome } from '../../model/operations/family';
import OperationsObjectHome from '../shared/list';

export const Component = () => {
	const families = useLoaderData() as FamilyHome[];
	useTitle(D.operationsTitle, D.familiesTitle);

	return (
		<OperationsObjectHome
			items={families}
			roles={[ADMIN]}
			title={D.familiesSearchTitle}
			childPath="operations/family"
			searchURL="/operations/families/search"
			createButton={<FeminineButton action="/operations/families/create" />}
		/>
	);
};
