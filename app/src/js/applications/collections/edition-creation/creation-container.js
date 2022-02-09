import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as select from 'js/reducers';
import buildPayload from 'js/utils/collections/build-payload/build-payload';
import CollectionEditionCreation from './home';
import D from 'js/i18n';
import emptyCollection from 'js/utils/collections/empty-collection';
import { cleanId, Loading } from '@inseefr/wilco';
import { ArrayUtils } from 'bauhaus-utilities';
import globalApi from '../../../remote-api/api';
import api from '../../../remote-api/concepts-api';

const CreationContainer = () => {
	const history = useHistory()
	const langs = useSelector(state => select.getLangs(state));
	const collection = useSelector(state => emptyCollection(state.app.properties.defaultContributor));

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [collectionList, setCollectionList] = useState([])
	const [conceptList, setConceptList] = useState([])
	const [stampList, setStampList] = useState([])

	useEffect(() => {
		Promise.all([
			globalApi.getStampList(),
			api.getConceptList(),
			api.getCollectionList()
		]).then(([ stampsList, conceptsList, collectionsList ]) => {
			setStampList(stampsList)
			setConceptList(ArrayUtils.sortArrayByLabel(conceptsList))
			setCollectionList(ArrayUtils.sortArrayByLabel(collectionsList))
		}).finally(() => setLoading(false))
	}, []);

	const handleCreation = useCallback((data) => {
		setSaving(true);
		api.postCollection(buildPayload(data, 'CREATE'))
			.then(() => {
				history.push(`/collection/${cleanId(data.general.id)}`)
			})
			.finally(() => setSaving(false))
	}, [history]);

	if(saving){
		return <Loading textType="saving" />;
	}
	if(loading){
		return <Loading />
	}

	const { general, members } = collection;
	return (
		<CollectionEditionCreation
			creation
			title={D.createCollectionTitle}
			general={general}
			members={members}
			collectionList={collectionList}
			conceptList={conceptList}
			stampList={stampList}
			save={handleCreation}
			langs={langs}
		/>
	);
}
export default CreationContainer;
