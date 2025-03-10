import { Classification, PartialClassification } from '@model/Classification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ClassificationsApi } from '@sdk/classification';

export const useClassifications = () => {
	const { isLoading, data: classifications } = useQuery<
		PartialClassification[]
	>({
		queryKey: ['classifications'],
		queryFn: ClassificationsApi.getList,
	});
	return { isLoading, classifications };
};
export const useClassification = (id: string) => {
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
export const usePublishClassification = (id: string) => {
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
			queryClient.invalidateQueries({
				queryKey: ['classifications', id],
			});
		},
	});
	return { isPublishing, publish, error };
};

export const useUpdateClassification = (id: string) => {
	const queryClient = useQueryClient();
	const {
		isPending: isSaving,
		mutate: save,
		error,
		isSuccess: isSavingSuccess,
		status,
	} = useMutation({
		mutationFn: (classification: Classification) => {
			return ClassificationsApi.putClassification(classification.general);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['classifications', id],
			});
		},
	});
	return { isSaving, save, error, isSavingSuccess, status };
};
