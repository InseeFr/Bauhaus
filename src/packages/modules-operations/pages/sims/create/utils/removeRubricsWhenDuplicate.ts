import { Rubric } from "@model/Sims";

import { DUPLICATE, Mode } from "../../constants";

export function removeRubricsWhenDuplicate(mode: Mode, rubrics: Record<string, Rubric> = {}) {
  /**
   * @type {string[]} name A name to use.
   */
  const blackList = ["I.6.4"];

  return Object.keys(rubrics).reduce((acc, rubricKey) => {
    if (mode === DUPLICATE && blackList.includes(rubricKey)) return acc;
    return {
      ...acc,
      [rubricKey]: {
        ...rubrics[rubricKey],
      },
    };
  }, {});
}
