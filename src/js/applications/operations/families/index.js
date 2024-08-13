import { useEffect, useState } from 'react';
import { ArrayUtils, Auth } from '../../../utils';
import D from '../../../i18n/build-dictionary';
import OperationsObjectHome from '../shared/list';
import { FeminineButton, Loading } from '../../../new-architecture/components';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';
import { OperationsApi } from '../../../new-architecture/sdk/operations-api';

export const FamiliesHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [families, setFamilies] = useState([]);
	useTitle(D.operationsTitle, D.familiesTitle);

	useEffect(() => {
		OperationsApi.getAllFamilies()
			.then((results) => setFamilies(ArrayUtils.sortArray('label')(results)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

	return (
		<OperationsObjectHome
			items={families}
			roles={[Auth.ADMIN]}
			title={D.familiesSearchTitle}
			childPath="operations/family"
			searchURL="/operations/families/search"
			createButton={<FeminineButton action="/operations/family/create" />}
		/>
	);
};

export default FamiliesHomeContainer;
