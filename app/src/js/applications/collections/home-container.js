import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import CollectionsHome from './home';
import { ArrayUtils, Auth } from 'bauhaus-utilities';
import api from '../../remote-api/concepts-api';

const CollectionsHomeContainer = () =>  {
	const permission = useSelector(state => Auth.getPermission(state));
	const [loading, setLoading] = useState(true);
	const [collections, setCollections] = useState([]);
	useEffect(() => {
		api.getCollectionList().then(body => {
			setCollections(ArrayUtils.sortArrayByLabel(body))
		}).finally(() => setLoading(false))
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<CollectionsHome collections={collections} permission={permission} />
	);
}

export default CollectionsHomeContainer
