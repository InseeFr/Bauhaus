import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../remote-api/concepts-api';
import { saveFileFromHttpResponse } from '../files';

export const useConcepts = () => {
	return useQuery({
		queryKey: ['concepts'],
		queryFn: () => {
			return api.getConceptList();
		},
	});
};

export const useConceptExporter = () => {
	return useMutation({
		mutationFn: ({ ids, type, lang, withConcepts }) => {
			return api
				.getConceptExportZipType(ids, type, lang, withConcepts)
				.then(saveFileFromHttpResponse);
		},
	});
};
