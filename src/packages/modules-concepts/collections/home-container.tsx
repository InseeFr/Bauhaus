import { Loading } from '@components/loading';

import CollectionsHome from './home';
import { useCollections } from '../../utils/hooks/collections';

export const Component = () => {
	const { data: collections, isLoading } = useCollections();

	if (isLoading) {
		return <Loading />;
	}
	return <CollectionsHome collections={collections} />;
};
