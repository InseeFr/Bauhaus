import { Loading } from '@components/loading';

import ClassificationsHome from './home';
import { useClassifications } from './hooks';

export const Component = () => {
	const { isLoading, classifications } = useClassifications();

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications!} />;
};
