import { Rubric } from "../../../../model/Sims";
import { rangeType } from "../../../constants/rangeType";

const { RICH_TEXT, TEXT, ORGANIZATION, DATE, GEOGRAPHY, CODE_LIST } = rangeType;

/**
 * Return true if the section of a MSD should display its labelLg2
 */
export function hasLabelLg2(section: Rubric) {
  const sectionsWhichDisplayLg2 = [TEXT, RICH_TEXT, ORGANIZATION, DATE, GEOGRAPHY, CODE_LIST];
  return sectionsWhichDisplayLg2.includes(section.rangeType);
}
