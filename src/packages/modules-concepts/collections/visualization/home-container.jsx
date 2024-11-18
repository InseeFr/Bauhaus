import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading, Publishing } from '@components/loading';
import CollectionVisualization from './home';
import { useParams } from 'react-router-dom';
import { ConceptsApi } from '../../../sdk';
import { getPermission } from '../../../redux/selectors';
import { useSecondLang } from '../../../utils/hooks/second-lang';

export const Component = () => {
	const { id } = useParams();
	const [collection, setCollection] = useState();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const permission = useSelector((state) => getPermission(state));
	const [secondLang] = useSecondLang();

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
		return <Publishing />;
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
		/>
	);
};
