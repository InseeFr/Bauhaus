import { useEffect, useState } from 'react';
import D from '../../deprecated-locales/build-dictionary';
import OperationsObjectHome from '../shared/list';
import { FeminineButton, Loading } from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { OperationsApi } from '../../sdk/operations-api';
import { sortArray } from '../../utils/array-utils';
import { ADMIN } from '../../auth/roles';
import { FamilyHome } from '../../model/operations/family';

export const FamiliesHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [families, setFamilies] = useState<FamilyHome[]>([]);
	useTitle(D.operationsTitle, D.familiesTitle);

	useEffect(() => {
		OperationsApi.getAllFamilies()
			.then((results: FamilyHome[]) => setFamilies(sortArray('label')(results)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

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

export default FamiliesHomeContainer;
