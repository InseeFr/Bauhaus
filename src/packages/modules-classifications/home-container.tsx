import { Loading } from '@components/loading';

import { useClassifications } from '@utils/hooks/classifications';

import ClassificationsHome from './home';

export const Component = () => {
	const { isLoading, data: classifications } = useClassifications();

	if (isLoading) return <Loading />;
	return <ClassificationsHome classifications={classifications!} />;
};
