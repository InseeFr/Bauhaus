import { useEffect, useState } from 'react';
import { Loading } from '../../../../components';
import Dashboard from './home';
import { ConceptsApi } from '../../../..//sdk';

const emptyItem = {
	id: '',
	label: '',
	created: '',
	modified: '',
	disseminationStatus: '',
	validationStatus: '',
	definition: '',
	creator: '',
	isTopConceptOf: '',
	valid: '',
};

export const Component = () => {
	const [loading, setLoading] = useState(true);
	const [concepts, setConcepts] = useState([]);
	const [collections, setCollections] = useState([]);

	useEffect(() => {
		Promise.all([
			ConceptsApi.getConceptSearchList(),
			ConceptsApi.getCollectionDashboardList(),
		])
			.then(([conceptsList, collectionsList]) => {
				setConcepts(
					conceptsList.map((concept) => ({ ...emptyItem, ...concept })),
				);

				setCollections(collectionsList);
			})
			.finally(() => setLoading(false));
	}, []);
	if (loading) {
		return <Loading />;
	}

	return <Dashboard conceptsData={concepts} collectionsData={collections} />;
};
