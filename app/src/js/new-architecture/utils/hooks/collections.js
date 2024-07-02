import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../remote-api/concepts-collection-api';
import { saveFileFromHttpResponse } from '../files';

export const useCollections = () => {
	return useQuery(['collections'], () => {
		return api.getCollectionList();
	});
};

export const useCollectionExporter = () => {
	return useMutation(({ ids, type, lang, withConcepts }) => {
		let promise;

		if (ids.length > 1) {
			promise = api.getCollectionExportZipByType(ids, type, lang, withConcepts);
		} else if (ids.length === 1) {
			promise = api.getCollectionExportByType(
				ids[0],
				'application/vnd.oasis.opendocument.text',
				type,
				lang,
				withConcepts
			);
		}

		return promise.then(saveFileFromHttpResponse);
	});
};
