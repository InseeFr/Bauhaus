import { stringToDate } from "@utils/date-utils";

export const SimsBlockDate = ({ currentSection }) => {
  return stringToDate(currentSection.value);
};
