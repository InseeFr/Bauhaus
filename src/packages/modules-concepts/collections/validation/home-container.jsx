import { useEffect, useState } from 'react';
import CollectionsToValidate from './home';
import { Loading, Publishing } from '@components/loading';
import D from '../../../deprecated-locales';
import { ConceptsApi } from '../../../sdk';
import { useTitle } from '@utils/hooks/useTitle';
import { usePermission } from '../../../redux/hooks/usePermission';
import { useNavigate } from 'react-router-dom';

export const Component = () => {
	useTitle(D.collectionsTitle, D.btnValid);

	const permission = usePermission();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [collections, setCollections] = useState([]);
	const navigate = useNavigate();

	const handleValidateCollectionList = (ids) => {
		setSaving(true);
		ConceptsApi.putCollectionValidList(ids)
			.then(() => setSaving(false))
			.finally(() => navigate('/concepts/collections'));
	};

	useEffect(() => {
		ConceptsApi.getCollectionValidateList()
			.then(setCollections)
			.then(() => setLoading(false));
	}, []);

	if (saving) return <Publishing />;
	if (loading) return <Loading />;
	return (
		<CollectionsToValidate
			collections={collections}
			permission={permission}
			handleValidateCollectionList={handleValidateCollectionList}
		/>
	);
};
