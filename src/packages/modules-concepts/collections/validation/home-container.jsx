import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CollectionsToValidate from './home';
import { Loading } from '../../../components';
import D from '../../../deprecated-locales';
import { ConceptsApi } from '../../../sdk';
import { useTitle } from '../../../utils/hooks/useTitle';
import { usePermission } from '../../../redux/hooks/usePermission';

const CollectionsToValidateContainer = () => {
	useTitle(D.collectionsTitle, D.btnValid);

	const permission = usePermission();
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
