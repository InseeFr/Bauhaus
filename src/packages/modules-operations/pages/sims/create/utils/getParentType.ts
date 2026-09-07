import { Sims } from "../../../../../model/Sims";

export const getParentType = (sims: Sims): "operation" | "series" | "indicator" | undefined => {
  if (sims.idOperation) {
    return "operation";
  }
  if (sims.idSeries) {
    return "series";
  }
  if (sims.idIndicator) {
    return "indicator";
  }
};
