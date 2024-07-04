import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../remote-api/concepts-api';
import { saveFileFromHttpResponse } from '../files';

export const useConcepts = () => {
	return useQuery(['concepts'], () => {
		return api.getConceptList();
	});
};

export const useConceptExporter = () => {
	return useMutation(({ ids, type, lang, withConcepts }) => {
		return api
			.getConceptExportZipType(ids, type, lang, withConcepts)
			.then(saveFileFromHttpResponse);
	});
};
