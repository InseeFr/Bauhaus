import { useQuery, useMutation } from '@tanstack/react-query';

import { ConceptsApi } from '../../sdk';
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
			return ConceptsApi.getConceptExportZipType(
				ids,
				type,
				lang,
				withConcepts,
			).then(saveFileFromHttpResponse);
		},
	});
};
