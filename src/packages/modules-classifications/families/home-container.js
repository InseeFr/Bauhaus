import { useEffect, useState } from 'react';
import { Loading } from '../../components';
import FamiliesHome from './home';
import { ClassificationsApi } from '../..//sdk/classification';

export const FamiliesHomeContainer = () => {
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

export default FamiliesHomeContainer;
