import { useQuery } from '@tanstack/react-query';

import { PartialDistribution } from '../model/Dataset';
import { DatasetsApi, DistributionApi } from '../sdk';

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
