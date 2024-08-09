import { Loading } from '../../new-architecture/components';
import ClassificationsHome from './home';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../new-architecture/sdk/classification';

const ClassificationsHomeContainer = () => {
	const { isLoading, data: classifications } = useQuery({
		queryKey: ['classifications'],
		queryFn: ClassificationsApi.getList,
	});

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
};

export default ClassificationsHomeContainer;
