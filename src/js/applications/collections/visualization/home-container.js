import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as select from '../../../reducers';
import { Loading } from '../../../new-architecture/components';
import CollectionVisualization from './home';
import { Auth, Stores } from '../../../utils';
import { useParams } from 'react-router-dom';
import { ConceptsApi } from '../../../new-architecture/sdk';

const CollectionVisualizationContainer = () => {
	const { id } = useParams();
	const [collection, setCollection] = useState();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const permission = useSelector((state) => Auth.getPermission(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => select.getLangs(state));

	const fetchData = useCallback(() => {
		Promise.all([
			ConceptsApi.getCollectionGeneral(id),
			ConceptsApi.getCollectionMembersList(id),
		])
			.then(([generalValue, membersValue]) => {
				setCollection({ general: generalValue, members: membersValue });
			})
			.finally(() => setLoading(false));
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleCollectionValidation = (id) => {
		setSaving(true);
		ConceptsApi.putCollectionValidList([id])
			.then(() => fetchData())
			.finally(() => setSaving(false));
	};
	if (loading) {
		return <Loading />;
	}

	if (saving) {
		return <Loading textType="validating" />;
	}
	const { general, members } = collection;

	return (
		<CollectionVisualization
			id={id}
			permission={permission}
			general={general}
			members={members}
			validateCollection={handleCollectionValidation}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};
export default CollectionVisualizationContainer;
