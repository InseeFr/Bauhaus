import { useEffect, useState } from 'react';
import { Loading } from '../../../../new-architecture/components/loading/loading';
import Dashboard from './home';
import api from '../../../../remote-api/concepts-api';

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

const DashboardContainer = () => {
	const [loading, setLoading] = useState(true);
	const [concepts, setConcepts] = useState([]);
	const [collections, setCollections] = useState([]);

	useEffect(() => {
		Promise.all([api.getConceptSearchList(), api.getCollectionDashboardList()])
			.then(([conceptsList, collectionsList]) => {
				setConcepts(
					conceptsList.map((concept) => Object.assign({}, emptyItem, concept))
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
export default DashboardContainer;
