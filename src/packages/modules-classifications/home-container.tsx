import { Loading } from '../components';
import ClassificationsHome from './home';
import { useClassifications } from '../utils/hooks/classifications';

export const Component = () => {
	const { isLoading, data: classifications } = useClassifications();

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
};
