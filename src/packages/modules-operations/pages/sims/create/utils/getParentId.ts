import { Sims } from "../../../../../model/Sims";

export function getParentId(sims: Sims) {
  return sims.idOperation || sims.idSeries || sims.idIndicator;
}
