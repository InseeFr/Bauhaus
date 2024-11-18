import { useEffect, useState } from 'react';
import { Loading } from '@components/loading';
import FamiliesHome from './home';
import { ClassificationsApi } from '../..//sdk/classification';

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
