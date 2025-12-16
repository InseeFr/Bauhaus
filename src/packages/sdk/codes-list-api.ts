import { buildApi } from "./build-api";

const api = {
  getCodesLists: () => [""],
  getPartialCodesLists: () => ["partial"],
  getCodesList: (notation: string) => [`${notation}`],
  getCodesListCodes: (notation: string, page: number, perPage: number) => [
    `${notation}/codes?page=${page}&per_page=${perPage}`,
  ],
  getPartialCodesList: (notation: string) => [`partial/${notation}`],
};

export const CodeListApi = buildApi("codeList", api) as any;

export const fetchCodeList = (notation: string) => {
  return Promise.all([
    CodeListApi.getCodesList(notation),
    CodeListApi.getCodesListCodes(notation, 1, 0),
  ]).then(([codesList, codes]) => ({
    codes: codes.items ?? [],
    ...codesList,
  }));
};
