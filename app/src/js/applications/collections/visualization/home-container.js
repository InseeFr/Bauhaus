import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as select from 'js/reducers';
import { Loading } from '@inseefr/wilco';
import CollectionVisualization from './home';
import { Auth, Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';
import api from '../../../remote-api/concepts-api';

const CollectionVisualizationContainer = () => {
	const { id } = useParams();
	const [collection, setCollection] = useState({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);


	const permission = useSelector(state => Auth.getPermission(state));
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));
	const langs = useSelector(state => select.getLangs(state))

	const fetchData = useCallback(() => {
		Promise.all([
			api.getCollectionGeneral(id),
			api.getCollectionMembersList(id),
		]).then(([generalValue, membersValue]) => {
			setCollection({ general: generalValue, members: membersValue});
		}).finally(() => setLoading(false))
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData])

	const handleCollectionValidation = (id) => {
		setSaving(true)
		api.putCollectionValidList([id])
			.then(() => fetchData())
			.finally(() => setSaving(false));
	}
	if(loading){
		return <Loading />
	}

	if(saving){
		return <Loading textType="validating" />
	}
	const { general, members } = collection;

	return (
		<CollectionVisualization
			id={id}
			permission={permission}
			general={general}
			members={members}
			validateCollection={handleCollectionValidation}
			secondLang={secondLang}
			langs={langs}
		/>
	);
}
export default CollectionVisualizationContainer;
