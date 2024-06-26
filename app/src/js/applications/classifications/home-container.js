import { Loading } from '@inseefr/wilco';
import ClassificationsHome from './home';
import api from 'js/remote-api/classifications-api';
import { useQuery } from '@tanstack/react-query';

const ClassificationsHomeContainer = () => {
	const { isLoading, data: classifications } = useQuery(
		['classifications'],
		api.getList
	);

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
};

export default ClassificationsHomeContainer;
