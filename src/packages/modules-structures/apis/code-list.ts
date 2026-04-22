import { CodelistsApi } from "@sdk/index";

import { sortArray } from "@utils/array-utils";

import { CodesList, CodesLists } from "../../model/CodesList";

const sortByLabel = sortArray("labelLg1");

export const getCodeList = () =>
  CodelistsApi.getCodesLists().then((response: CodesList[]) => sortByLabel(response));

export const getPartialCodeLists = () =>
  CodelistsApi.getPartialCodesLists().then((response: CodesList[]) => sortByLabel(response));

export const getFormattedCodeList = (): Promise<CodesLists> => {
  return Promise.all([getCodeList(), getPartialCodeLists()]).then(([codelist, partialCodeList]) => {
    return [...codelist, ...partialCodeList]?.map(({ uri, labelLg1, id }) => {
      return {
        id: uri,
        label: labelLg1,
        notation: id,
      };
    });
  });
};
