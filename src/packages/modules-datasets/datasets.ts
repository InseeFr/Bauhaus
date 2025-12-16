import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { DatasetsApi, DistributionApi } from '@sdk/index';

import { useGoBack } from '@utils/hooks/useGoBack';

import { Distribution, PartialDistribution } from '../model/Dataset';

export const useDatasets = () => {
	return useQuery({
		queryFn: () => DatasetsApi.getAll(),
		queryKey: ['datasets'],
	});
};

export const useDatasetsForDistributions = () => {
	return useQuery({
		queryFn: () => DistributionApi.getDatasets(),
		queryKey: ['datasets-distributions'],
	});
};

export const useDistributions = () => {
	return useQuery<PartialDistribution[]>({
		queryFn: () => DistributionApi.getAll(),
		queryKey: ['distributions'],
	});
};

export const useDistribution = (id: string) => {
	return useQuery({
		enabled: !!id,
		queryKey: ['distributions', id],
		queryFn: () => DistributionApi.getById(id),
	});
};

export const useDataset = (id: string) => {
	return useQuery({
		enabled: !!id,
		queryKey: ['datasets', id],
		queryFn: () => DatasetsApi.getById(id),
	});
};

export const useDatasetPublisher = (id: string) => {
	const queryClient = useQueryClient();

	const {
		isPending: isPublishing,
		mutate: publish,
		error: validationServerSideError,
	} = useMutation({
		mutationFn: () => {
			return DistributionApi.publish(id);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['distributions', id],
			});
		},
	});

	return { isPublishing, publish, validationServerSideError };
};

export const useDatasetDeleter = (id: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		isPending: isDeleting,
		mutate: remove,
		error: deleteServerSideError,
	} = useMutation({
		mutationFn: () => {
			return DistributionApi.deleteDistribution(id);
		},

		onSuccess: (id) => {
			return Promise.all([
				queryClient.removeQueries({ queryKey: ['distributions', id] }),
				queryClient.invalidateQueries({ queryKey: ['distributions'] }),
			]).then(() => navigate('/datasets/distributions'));
		},
	});

	return { isDeleting, remove, deleteServerSideError };
};

export const useCreateOrUpdateDistribution = (isEditing: boolean) => {
	const queryClient = useQueryClient();
	const goBack = useGoBack();

	const {
		isPending: isSaving,
		mutate: save,
		error: serverSideError,
	} = useMutation({
		mutationFn: (distribution: Partial<Distribution>) => {
			const promise = isEditing
				? DistributionApi.putDistribution
				: DistributionApi.postDistribution;
			return promise(distribution).catch((e: unknown) => {
				throw e;
			});
		},
		onSuccess: (id) => {
			if (isEditing) {
				queryClient.invalidateQueries({
					queryKey: ['distributions', id],
				});
			}
			queryClient.invalidateQueries({
				queryKey: ['distributions'],
			});

			goBack(`/datasets/distributions/${id}`, !isEditing);
		},
	});

	return { isSaving, save, serverSideError };
};
