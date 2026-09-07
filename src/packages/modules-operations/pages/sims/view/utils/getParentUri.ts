import { Sims } from "../../../../../model/Sims";

export function getParentUri(sims: Sims) {
  if (sims.idOperation) {
    return `/operations/operation/${sims.idOperation}`;
  } else if (sims.idSeries) {
    return `/operations/series/${sims.idSeries}`;
  } else if (sims.idIndicator) {
    return `/operations/indicator/${sims.idIndicator}`;
  }
}
