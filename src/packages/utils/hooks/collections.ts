import { useQuery, useMutation } from '@tanstack/react-query';
import { saveFileFromHttpResponse } from '../files';
import { CollectionApi } from '@sdk/collection-api';

export const useCollections = () => {
	return useQuery({
		queryKey: ['collections'],
		queryFn: () => {
			return CollectionApi.getCollectionList();
		},
	});
};

export const useCollectionExporter = () => {
	return useMutation({
		mutationFn: ({
			ids,
			type,
			lang,
			withConcepts,
		}: {
			ids: string[];
			type: string;
			lang: string;
			withConcepts: boolean;
		}) => {
			let promise;

			if (ids.length > 1) {
				promise = CollectionApi.getCollectionExportZipByType(
					ids,
					type,
					lang,
					withConcepts,
				);
			} else if (ids.length === 1) {
				promise = CollectionApi.getCollectionExportByType(
					ids[0],
					'application/vnd.oasis.opendocument.text',
					type,
					lang,
					withConcepts,
				);
			}

			return promise.then(saveFileFromHttpResponse);
		},
	});
};
