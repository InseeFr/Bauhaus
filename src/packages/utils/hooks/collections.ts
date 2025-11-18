import { useQuery, useMutation } from '@tanstack/react-query';


import { CollectionApi } from '@sdk/collection-api';

import { saveFileFromHttpResponse } from '../files';


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
