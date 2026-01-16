import { getGeneral } from "./general";
import { getLevels } from "./levels";

export function getClassification(state: any, id: string) {
  const general = getGeneral(state.classificationGeneral, id);
  if (!general) return;
  const levels = getLevels(state.classificationLevels, id);
  if (!levels) return;
  return {
    general,
    levels,
  };
}
