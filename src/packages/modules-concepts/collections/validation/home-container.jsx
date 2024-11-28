import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loading, Publishing } from '@components/loading';

import { ConceptsApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import { usePermission } from '../../../redux/hooks/usePermission';
import CollectionsToValidate from './home';

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
