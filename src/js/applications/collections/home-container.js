import { useEffect, useState } from 'react';
import { Loading } from '../../new-architecture/components';
import CollectionsHome from './home';
import { CollectionApi } from '../../new-architecture/sdk/collection-api';

const CollectionsHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	useEffect(() => {
		CollectionApi.getCollectionList()
			.then(setCollections)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return <CollectionsHome collections={collections} />;
};

export default CollectionsHomeContainer;
