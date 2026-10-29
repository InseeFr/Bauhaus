import type { CodeListUsage } from "../../types/api";

export interface PhysicalInstanceSummary {
  agency: string;
  id: string;
  label: string;
}

/**
 * Pour chaque variable, les PhysicalInstances AUTRES que {@code current} qui l'utilisent (#1387),
 * chacune une seule fois. Une variable absente de la map n'est utilisée que par la PI courante :
 * la modifier n'impacte aucun autre fichier.
 */
export const otherPhysicalInstancesByVariable = (
  usages: CodeListUsage[],
  current: { agency: string; id: string },
): Map<string, PhysicalInstanceSummary[]> => {
  const result = new Map<string, PhysicalInstanceSummary[]>();
  for (const usage of usages) {
    const { physicalInstanceAgencyId: agency, physicalInstanceId: id } = usage;
    if (agency === current.agency && id === current.id) {
      continue;
    }
    const others = result.get(usage.variableId) ?? [];
    if (!others.some((other) => other.agency === agency && other.id === id)) {
      others.push({ agency, id, label: usage.physicalInstanceLabel || id });
      result.set(usage.variableId, others);
    }
  }
  return result;
};
