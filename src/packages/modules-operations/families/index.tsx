import { useEffect, useState } from 'react';
import D from '../../deprecated-locales/build-dictionary';
import OperationsObjectHome from '../shared/list';
import { FeminineButton, Loading } from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { OperationsApi } from '../../sdk/operations-api';
import { ADMIN } from '../../auth/roles';
import { FamilyHome } from '../../model/operations/family';

export const Component = () => {
	const [families, setFamilies] = useState<FamilyHome[] | undefined>();
	useTitle(D.operationsTitle, D.familiesTitle);

	useEffect(() => {
		OperationsApi.getAllFamilies().then(setFamilies);
	}, []);

	if (!families) return <Loading />;

	return (
		<OperationsObjectHome
			items={families}
			roles={[ADMIN]}
			title={D.familiesSearchTitle}
			childPath="operations/family"
			searchURL="/operations/families/search"
			createButton={<FeminineButton action="/operations/family/create" />}
		/>
	);
};
