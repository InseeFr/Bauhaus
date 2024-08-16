import { Loading } from '../components';
import ClassificationsHome from './home';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '..//sdk/classification';

const ClassificationsHomeContainer = () => {
	const { isLoading, data: classifications } = useQuery({
		queryKey: ['classifications'],
		queryFn: ClassificationsApi.getList,
	});

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
};

export default ClassificationsHomeContainer;
