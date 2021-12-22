import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import FamiliesHome from './home';
import api from '../../../remote-api/operations-api';

export const FamiliesHomeContainer = () => {
	const [loading, setLoading] = useState(true);
	const [families, setFamilies] = useState([]);
	useEffect(() => {
		api.getFamiliesList()
			.then(results => setFamilies(results))
			.finally(() => setLoading(false))
	}, [])

	if (loading) return <Loading />;
	return <FamiliesHome families={families} />;
}


export default FamiliesHomeContainer;
