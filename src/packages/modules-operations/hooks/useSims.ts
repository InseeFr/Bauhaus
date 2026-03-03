import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { OperationsApi } from "@sdk/operations-api";

import { D1, D2 } from "../../deprecated-locales";
import { Rubric } from "../../model/Sims";

const computeRubrics = (rubrics: Rubric[]): Record<string, Rubric & { idMas: string }> => {
  return (rubrics || []).reduce(
    (acc: Record<string, Rubric & { idMas: string }>, rubric: Rubric) => {
      return {
        ...acc,
        [rubric.idAttribute]: {
          ...rubric,
          idMas: rubric.idAttribute,
        },
      };
    },
    {},
  );
};

const getParentsWithoutSims = async (idOperation?: string) => {
  if (idOperation) {
    const operation = await OperationsApi.getOperation(idOperation);
    return OperationsApi.getOperationsWithoutReport(operation.series.id);
  }
  return [];
};

export const useSims = (id?: string) => {
  const { isLoading, data: sims } = useQuery({
    queryKey: ["sims", id],
    queryFn: async () => {
      const results = await OperationsApi.getSims(id);
      const parentsWithoutSims = await getParentsWithoutSims(results.idOperation);

      return {
        ...results,
        parentsWithoutSims,
        rubrics: computeRubrics(results.rubrics),
      };
    },
    enabled: !!id,
  });

  return { isLoading, sims };
};

const mergeLabels = (sims: any, parent: any) => {
  return {
    ...sims,
    labelLg1: D1.simsTitle + parent.prefLabelLg1,
    labelLg2: D2.simsTitle + parent.prefLabelLg2,
  };
};

const getFetchLabelsPromise = async (sims: any) => {
  if (sims.idOperation) {
    const parent = await OperationsApi.getOperation(sims.idOperation);
    return mergeLabels(sims, parent);
  }
  if (sims.idSeries) {
    const parent = await OperationsApi.getSerie(sims.idSeries);
    return mergeLabels(sims, parent);
  }
  if (sims.idIndicator) {
    const parent = await OperationsApi.getIndicatorById(sims.idIndicator);
    return mergeLabels(sims, parent);
  }
  return sims;
};

export const useSaveSims = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sims: any) => {
      let simsToSave = sims;

      if (!sims.labelLg1) {
        simsToSave = await getFetchLabelsPromise(sims);
      }

      const method = sims.id ? "putSims" : "postSims";
      const result = await OperationsApi[method](simsToSave);

      return result || sims.id;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sims", variables.id] });
    },
  });
};

export const usePublishSims = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sims: any) => {
      return OperationsApi.publishSims(sims);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sims", variables.id] });
    },
  });
};
