import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClassificationsApi } from '@sdk/classification';

export const useClassification = (id) => {
	const { isLoading, data: classification } = useQuery({
		queryKey: ['classifications', id],
		queryFn: () => {
			return Promise.all([
				ClassificationsApi.getClassificationGeneral(id),
				ClassificationsApi.getClassificationLevels(id),
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
		isPending: isPublishing,
		mutate: publish,
		error,
	} = useMutation({
		mutationFn: () => {
			return ClassificationsApi.publishClassification(id);
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
		isPending: isSaving,
		mutate: save,
		error,
		isSuccess: isSavingSuccess,
		status,
	} = useMutation({
		mutationFn: (classification) => {
			return ClassificationsApi.putClassification(classification.general);
		},

		onSuccess: () => {
			queryClient.invalidateQueries(['classifications', id]);
		},
	});
	return { isSaving, save, error, isSavingSuccess, status };
};
