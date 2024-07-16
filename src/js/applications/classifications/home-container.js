import { Loading } from '../../new-architecture/components/loading/loading';
import ClassificationsHome from './home';
import api from '../../remote-api/classifications-api';
import { useQuery } from '@tanstack/react-query';

const ClassificationsHomeContainer = () => {
	const { isLoading, data: classifications } = useQuery({
		queryKey: ['classifications'],
		queryFn: api.getList,
	});

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
};

export default ClassificationsHomeContainer;
