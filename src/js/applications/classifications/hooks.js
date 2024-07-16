import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../remote-api/classifications-api';

export const useClassification = (id) => {
	const { isLoading, data: classification } = useQuery({
		queryKey: ['classifications', id],
		queryFn: () => {
			return Promise.all([
				api.getClassificationGeneral(id),
				api.getClassificationLevels(id),
			]).then(([general, levels]) => {
				return { general, levels };
			});
		},
	});

	return { isLoading, classification };
};
export const usePublishClassification = (id) => {
	const queryClient = useQueryClient();
	const {
		isLoading: isPublishing,
		mutate: publish,
		error,
	} = useMutation({
		mutationFn: (id) => {
			return api.publishClassification(id);
		},

		onSuccess: () => {
			queryClient.invalidateQueries(['classifications', id]);
		},
	});
	return { isPublishing, publish, error };
};

export const useUpdateClassification = (id) => {
	const queryClient = useQueryClient();
	const {
		isLoading: isSaving,
		mutate: save,
		error,
		isSuccess: isSavingSuccess,
		status,
	} = useMutation({
		mutationFn: (classification) => {
			return api.putClassification(classification.general);
		},

		onSuccess: () => {
			queryClient.invalidateQueries(['classifications', id]);
		},
	});
	return { isSaving, save, error, isSavingSuccess, status };
};
