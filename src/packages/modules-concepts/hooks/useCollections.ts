import {useQuery} from "@tanstack/react-query";
import { CollectionApi as NewCollectionApi } from '@sdk/new-collection-api';

export const useCollections = () => {
	return useQuery({
		queryKey: ['collections'],
		queryFn: () => {
			return NewCollectionApi.getCollectionList();
		},
		placeholderData: [],
	});
};