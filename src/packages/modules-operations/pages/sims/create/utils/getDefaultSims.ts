import { Rubric } from "../../../../../model/Sims";
import { flattenTree } from "../../../../utils/flattenTree";
import { DUPLICATE, HELP, CREATE, UPDATE, VIEW } from "../../constants";
import { removeRubricsWhenDuplicate } from "./removeRubricsWhenDuplicate";

export type MsdMode = typeof HELP | typeof CREATE | typeof VIEW | typeof UPDATE | typeof DUPLICATE;

export const getDefaultSims = (
  mode: MsdMode,
  rubrics: Rubric[],
  metadataStructure: any,
): Record<string, Rubric> => {
  const flattenStructure = flattenTree(metadataStructure);

  return {
    ...Object.keys(flattenStructure).reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          rangeType: flattenStructure[key].rangeType,
          idAttribute: key,
          value: "",
          labelLg1: "",
          labelLg2: "",
        },
      };
    }, {}),
    ...removeRubricsWhenDuplicate(mode, rubrics),
  };
};
