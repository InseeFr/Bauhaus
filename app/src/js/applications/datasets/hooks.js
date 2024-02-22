import { useQuery } from '@tanstack/react-query';
import datasetApi from '../../remote-api/datasets/datasets-api';
import operationApi from '../../remote-api/operations-api';
import distributionApi from '../../remote-api/datasets/distributions-api';

export const useDatasets = () => {
	return useQuery({
		queryFn: () => datasetApi.getAll(),
		queryKey: ['datasets'],
	});
};

export const useDistributions = () => {
	return useQuery({
		queryFn: () => distributionApi.getAll(),
		queryKey: ['distributions'],
	});
};

export const useDistribution = (id) => {
	return useQuery({
		enabled: !!id,
		queryKey: ['distributions', id],
		queryFn: () => distributionApi.getById(id),
	});
};

export const useDataset = (id) => {
	return useQuery({
		enabled: !!id,
		queryKey: ['datasets', id],
		queryFn: () =>
			datasetApi.getById(id).then((dataset) => {
				if (!!dataset.idSerie) {
					return operationApi.getSerie(dataset.idSerie).then((serie) => {
						return {
							...dataset,
							serie,
						};
					});
				}

				return dataset;
			}),
	});
};
