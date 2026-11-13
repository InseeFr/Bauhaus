import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type {
  CodeListUsage,
  PhysicalInstanceResponse,
  Variable,
} from "../physical-instances/types/api";
import { itemsOfType } from "../physical-instances/types/ddi4Items";

/**
 * Les variables du VariableScheme de la StudyUnit (#1387) : le vivier dans lequel une
 * PhysicalInstance de l'étude peut réutiliser une variable. Paresseux : le back ne descend
 * l'arborescence Colectica qu'à l'ouverture du sélecteur.
 */
export const useStudyUnitVariables = (agencyId: string, id: string, enabled = true) =>
  useQuery<Variable[]>({
    queryKey: ["studyUnitVariables", agencyId, id],
    queryFn: async () => {
      const response: PhysicalInstanceResponse = await DDIApi.getStudyUnitVariables(agencyId, id);
      return itemsOfType(response, "Variable");
    },
    enabled: enabled && !!agencyId && !!id,
  });

/**
 * Une ligne par variable utilisée par chaque PhysicalInstance de la StudyUnit (#1387) : une
 * variable présente dans une autre PI est partagée, et la modifier mettra cette PI à jour.
 * Évincée par {@code usePublishPhysicalInstance}, seule une sauvegarde change les usages.
 */
export const useStudyUnitVariableUsages = (agencyId: string, id: string) =>
  useQuery<CodeListUsage[]>({
    queryKey: ["studyUnitVariableUsages", agencyId, id],
    queryFn: () => DDIApi.getStudyUnitVariableUsages(agencyId, id),
    enabled: !!agencyId && !!id,
  });
