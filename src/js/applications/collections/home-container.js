import { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import CollectionsHome from './home';
import { ArrayUtils } from 'js/utils';
import api from '../../remote-api/concepts-collection-api';

const CollectionsHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	useEffect(() => {
		api
			.getCollectionList()
			.then((body) => {
				setCollections(ArrayUtils.sortArrayByLabel(body));
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return <CollectionsHome collections={collections} />;
};

export default CollectionsHomeContainer;
