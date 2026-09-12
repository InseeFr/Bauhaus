import { stringToDate } from "@utils/date-utils";

import type { SimsBlockRubric } from "./SimsBlock";

interface SimsBlockDateTypes {
  currentSection: SimsBlockRubric;
}

export const SimsBlockDate = ({ currentSection }: Readonly<SimsBlockDateTypes>) => {
  return stringToDate(currentSection.value);
};
