import { useQuery, useMutation } from '@tanstack/react-query';
import { ConceptsApi } from '../../../new-architecture/sdk';
import { saveFileFromHttpResponse } from '../files';

export const useConcepts = () => {
	return useQuery({
		queryKey: ['concepts'],
		queryFn: () => {
			return ConceptsApi.getConceptList();
		},
	});
};

export const useConceptExporter = () => {
	return useMutation({
		mutationFn: ({ ids, type, lang, withConcepts }) => {
			return ConceptsApi.getConceptExportZipType(
				ids,
				type,
				lang,
				withConcepts
			).then(saveFileFromHttpResponse);
		},
	});
};
