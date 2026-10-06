import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Rubric } from "@model/Sims";

import { OperationsApi } from "@sdk/operations-api";

import { useInvalidateOperations } from "@utils/hooks/operations";
import { useInvalidateSeries } from "@utils/hooks/series";

import { useInvalidateIndicators } from "./useIndicators";

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
  const {
    isLoading,
    data: sims,
    error,
  } = useQuery({
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

  return { isLoading, sims, error };
};

const mergeLabels = (sims: any, parent: any, simsTitleLg1: string, simsTitleLg2: string) => {
  return {
    ...sims,
    labelLg1: simsTitleLg1 + parent.prefLabelLg1,
    labelLg2: simsTitleLg2 + parent.prefLabelLg2,
  };
};

const getFetchLabelsPromise = async (sims: any, simsTitleLg1: string, simsTitleLg2: string) => {
  if (sims.idOperation) {
    const parent = await OperationsApi.getOperation(sims.idOperation);
    return mergeLabels(sims, parent, simsTitleLg1, simsTitleLg2);
  }

  if (sims.idSeries) {
    const parent = await OperationsApi.getSerie(sims.idSeries);
    return mergeLabels(sims, parent, simsTitleLg1, simsTitleLg2);
  }

  if (sims.idIndicator) {
    const parent = await OperationsApi.getIndicatorById(sims.idIndicator);
    return mergeLabels(sims, parent, simsTitleLg1, simsTitleLg2);
  }

  return sims;
};

export const useSaveSims = () => {
  const queryClient = useQueryClient();

  const invalidateIndicators = useInvalidateIndicators();

  const invalidateSeries = useInvalidateSeries();

  const invalidateOperations = useInvalidateOperations();

  const { t } = useTranslation();

  const simsTitleLg1 = t("sims.simsTitle", { lng: "fr" });
  const simsTitleLg2 = t("sims.simsTitle", { lng: "en" });

  return useMutation({
    meta: { globalErrorToast: false },
    mutationFn: async (sims: any) => {
      let simsToSave = sims;
      if (!sims.labelLg1) {
        simsToSave = await getFetchLabelsPromise(sims, simsTitleLg1, simsTitleLg2);
      }
      const method = sims.id ? "putSims" : "postSims";
      const result = await OperationsApi[method](simsToSave);
      return result || sims.id;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sims", variables.id] });
      // La fiche de l'élément documenté (indicateur, série, opération) mène à son SIMS (`idSims`).
      if (variables.idIndicator) return invalidateIndicators();
      if (variables.idSeries) return invalidateSeries();
      if (variables.idOperation) return invalidateOperations();
    },
  });
};

export const usePublishSims = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { globalErrorToast: false },
    mutationFn: async (sims: any) => {
      return OperationsApi.publishSims(sims);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sims", variables.id] });
    },
  });
};
