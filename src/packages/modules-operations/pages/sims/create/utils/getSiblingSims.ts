import { OperationsApi } from "@sdk/operations-api";

import { Rubric } from "../../../../../model/Sims";
import { DUPLICATE } from "../../constants";
import { getDefaultSims } from "./getDefaultSims";

export const getSiblingSims = (
  id: string,
  metadataStructure: any,
): Promise<Record<string, Rubric>> => {
  return OperationsApi.getSims(id).then((result: any) => {
    return getDefaultSims(
      DUPLICATE,
      result.rubrics.reduce((acc: Record<string, Rubric>, rubric: Rubric) => {
        return {
          ...acc,
          [rubric.idAttribute]: rubric,
        };
      }, {}),
      metadataStructure,
    );
  });
};
