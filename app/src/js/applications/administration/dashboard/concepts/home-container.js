import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import Dashboard from './home';
import api from '../../../../remote-api/concepts-api';
import { ArrayUtils } from 'bauhaus-utilities';

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
		Promise.all([
			api.getConceptSearchList(),
			api.getCollectionDashboardList()
		]).then(([ conceptsList, collectionsList ]) => {

			setConcepts(ArrayUtils.sortArrayByLabel(conceptsList).map(concept =>
				Object.assign({}, emptyItem, concept)
			))

			setCollections(ArrayUtils.sortArrayByLabel(collectionsList));
		}).finally(() => setLoading(false))
	}, [])
	if(loading){
		return <Loading />;
	}

	return (
		<Dashboard
			conceptsData={concepts}
			collectionsData={collections}
		/>
	);
}
export default DashboardContainer;
