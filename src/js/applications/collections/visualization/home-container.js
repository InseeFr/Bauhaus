import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '../../../new-architecture/components';
import CollectionVisualization from './home';
import { Auth } from '../../../utils';
import { useParams } from 'react-router-dom';
import { ConceptsApi } from '../../../new-architecture/sdk';
import { getLocales } from '../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../new-architecture/redux/second-lang';

const CollectionVisualizationContainer = () => {
	const { id } = useParams();
	const [collection, setCollection] = useState();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const permission = useSelector((state) => Auth.getPermission(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const langs = useSelector((state) => getLocales(state));

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
