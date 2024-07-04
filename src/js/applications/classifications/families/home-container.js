import { useEffect, useState } from 'react';
import { Loading } from 'js/new-architecture/components/loading/loading';
import FamiliesHome from './home';
import api from 'js/remote-api/classifications-api';

export const FamiliesHomeContainer = () => {
	const [families, setFamilies] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.getFamiliesList()
			.then((result) => setFamilies(result))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}

	return <FamiliesHome families={families} />;
};

export default FamiliesHomeContainer;
