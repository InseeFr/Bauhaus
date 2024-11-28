import { useEffect, useState } from 'react';

import { Loading } from '@components/loading';

import { ClassificationsApi } from '@sdk/classification';

import FamiliesHome from './home';

export const Component = () => {
	const [families, setFamilies] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		ClassificationsApi.getFamiliesList()
			.then((result) => setFamilies(result))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}

	return <FamiliesHome families={families} />;
};
