import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import ConceptSearchList from './home';
import { ArrayUtils, Stores } from 'bauhaus-utilities';
import api from '../../../remote-api/concepts-api';
import apiGlobal from '../../../remote-api/api';

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

const ConceptSearchListContainer = () => {
	const [ loading, setLoading ] = useState(true);
	const [ conceptSearchList, setConceptSearchList ] = useState([]);
	const [ stampList, setStampList ] = useState([]);
	const [ disseminationStatusList, setDisseminationStatusList ] = useState([]);

	useEffect(() => {
		Promise.all([
			api.getConceptSearchList(),
			apiGlobal.getStampList(),
			Stores.DisseminationStatus.api.getDisseminationStatus()
		]).then(([ concepts, stamps, disseminations ]) => {
			setConceptSearchList(ArrayUtils.sortArrayByLabel(concepts).map(concept =>
				Object.assign({}, emptyItem, concept)
			));
			setStampList(stamps);
			setDisseminationStatusList(disseminations);
		}).finally(() => setLoading(false))
	}, []);

	if(loading){
		return <Loading />
	}

	return (
		<ConceptSearchList
			conceptSearchList={conceptSearchList}
			stampList={stampList}
			disseminationStatusList={disseminationStatusList}
		/>
	);
}

export default ConceptSearchListContainer
