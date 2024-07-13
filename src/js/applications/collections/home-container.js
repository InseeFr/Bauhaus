import { useEffect, useState } from 'react';
import { Loading } from '../../new-architecture/components/loading/loading';
import CollectionsHome from './home';
import api from '../../remote-api/concepts-collection-api';

const CollectionsHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	useEffect(() => {
		api
			.getCollectionList()
			.then(setCollections)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return <CollectionsHome collections={collections} />;
};

export default CollectionsHomeContainer;
