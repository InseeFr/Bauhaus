import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CollectionsToValidate from './home';
import { Loading } from '../../../new-architecture/components';
import { Auth, useTitle } from '../../../utils';
import D from '../../../i18n';
import { ConceptsApi } from '../../../new-architecture/sdk';

const CollectionsToValidateContainer = () => {
	useTitle(D.collectionsTitle, D.btnValid);

	const permission = useSelector((state) => Auth.getPermission(state));
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [collections, setCollections] = useState([]);
	const history = useHistory();

	const handleValidateCollectionList = (ids) => {
		setSaving(true);
		ConceptsApi.putCollectionValidList(ids)
			.then(() => setSaving(false))
			.finally(() => history.push('/collections'));
	};

	useEffect(() => {
		ConceptsApi.getCollectionValidateList()
			.then(setCollections)
			.then(() => setLoading(false));
	}, []);

	if (saving) return <Loading textType="validating" />;
	if (loading) return <Loading />;
	return (
		<CollectionsToValidate
			collections={collections}
			permission={permission}
			handleValidateCollectionList={handleValidateCollectionList}
		/>
	);
};

export default CollectionsToValidateContainer;
