import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import CollectionEditionCreation from './home';
import buildPayload from 'js/utils/collections/build-payload/build-payload';
import D from 'js/i18n';
import { Loading, cleanId } from '@inseefr/wilco';
import { ArrayUtils } from 'bauhaus-utilities';
import api from '../../../remote-api/concepts-api';
import globalApi from '../../../remote-api/api';

const EditionContainer = () => {
	const { id } = useParams();
	const history = useHistory();
	const langs = useSelector(state => select.getLangs(state));

	const [loadingCollection, setLoadingCollection] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);

	const [collection, setCollection] = useState({ })
	const [collectionList, setCollectionList] = useState([])
	const [conceptList, setConceptList] = useState([])
	const [stampList, setStampList] = useState([])

	useEffect(() => {
		Promise.all([
			api.getCollectionGeneral(id),
			api.getCollectionMembersList(id)
		]).then(([general, members]) => {
			setCollection({ general, members });
		}).finally(() => setLoadingCollection(false))
	}, [id])

	useEffect(() => {
		Promise.all([
			globalApi.getStampList(),
			api.getConceptList(),
			api.getCollectionList()
		]).then(([ stampsList, conceptsList, collectionsList ]) => {
			setStampList(stampsList)
			setConceptList(ArrayUtils.sortArrayByLabel(conceptsList))
			setCollectionList(ArrayUtils.sortArrayByLabel(collectionsList))
		}).finally(() => setLoadingExtraData(false))
	}, []);

	const handleUpdate = useCallback((data) => {
		setSaving(true);
		api.putCollection(data.general.id, buildPayload(data, 'UPDATE'))
			.then(() => {
				history.push(`/collection/${cleanId(id)}`)
			})
			.finally(() => setSaving(false))
	}, [history, id]);

	if(saving){
		return <Loading textType="saving" />
	}
	if(loadingCollection || loadingExtraData){
		return <Loading />
	}

	const { general, members } = collection;

	return (
		<CollectionEditionCreation
			title={D.updateCollectionTitle}
			subtitle={general.prefLabelLg1}
			general={general}
			members={members}
			collectionList={collectionList}
			conceptList={conceptList}
			stampList={stampList}
			save={handleUpdate}
			langs={langs}
		/>
	);
}

export default EditionContainer;
