import { buildApi } from "./build-api";

const api = {
  // --- Codelists ---
  getCodelists: () => [""],
  /** @deprecated Use getCodelists */
  getCodesLists: () => [""],
  getCodelist: (id: string) => [`${id}`],
  /** @deprecated Use getCodelist */
  getCodesList: (notation: string) => [`${notation}`],
  publishCodelist: (id: string) => [
    `validate/${id}`,
    { method: "PUT" },
    (res: Response) => res.text(),
  ],
  getDetailedCodelist: (id: string) => [`detailed/${id}`],
  postCodesDetailedCodelist: (id: string, code: any) => [
    `detailed/${id}/codes`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(code),
    },
    (res: Response) => res.text(),
  ],
  putCodesDetailedCodelist: (id: string, code: any) => [
    `detailed/${id}/codes/${code.code}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(code),
    },
    (res: Response) => res.text(),
  ],
  deleteCodesDetailedCodelist: (id: string, code: any) => [
    `detailed/${id}/codes/${code.code}`,
    {},
    (res: Response) => res.text(),
  ],
  getCodesDetailedCodelist: (id: string, page: number) => [`detailed/${id}/codes?page=${page}`],
  getCodesListCodes: (notation: string, page: number, perPage: number) => [
    `${notation}/codes?page=${page}&per_page=${perPage}`,
  ],
  getCodesByCode: (id: string, value: string) => [
    `detailed/${id}/codes?page=1&search=code:${value}`,
  ],
  getCodesByLabel: (id: string, value: string) => [
    `detailed/${id}/codes?page=1&search=labelLg1:${value}`,
  ],
  getCodesByCodeAndLabel: (id: string, valueCode: string, valueLabel: string) => [
    `detailed/${id}/codes?page=1&search=code:${valueCode}&search=labelLg1:${valueLabel}`,
  ],
  getSortedCodes: (id: string, sort: string) => [`detailed/${id}/codes?page=1&sort=${sort}`],
  getPartialsByParent: (parentCode: string) => [`partial/parent/${parentCode}`],
  getCodelistsForSearch: () => ["search"],
  getCodelistCode: (id: string, code: string) => [`${id}/code/${code}`],
  postCodelist: (codelist: any) => [
    "",
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(codelist),
    },
    (res: Response) => res.text(),
  ],
  putCodelist: (codelist: any) => [
    `${codelist.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(codelist),
    },
    (res: Response) => res.text(),
  ],
  deleteCodelist: (id: string) => [id, {}, () => Promise.resolve()],

  // --- Partial codelists ---
  getCodelistsPartial: () => ["partial"],
  /** @deprecated Use getCodelistsPartial */
  getPartialCodesLists: () => ["partial"],
  getCodelistPartial: (id: string) => [`partial/${id}`],
  /** @deprecated Use getCodelistPartial */
  getPartialCodesList: (notation: string) => [`partial/${notation}`],
  publishPartialCodelist: (id: string) => [
    `partial/${id}/validate`,
    { method: "PUT" },
    (res: Response) => res.text(),
  ],
  getCodelistsPartialForSearch: () => ["partial/search"],
  postCodelistPartial: (codelist: any) => [
    "partial",
    {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(codelist),
    },
    () => {},
  ],
  putCodelistPartial: (codelist: any) => [
    `partial/${codelist.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(codelist),
    },
    () => {},
  ],
  deleteCodelistPartial: (id: string) => ["partial/" + id, {}, () => Promise.resolve()],
};

export const CodelistsApi = buildApi("codeList", api) as any;

export const fetchCodeList = (notation: string) => {
  return Promise.all([
    CodelistsApi.getCodesList(notation),
    CodelistsApi.getCodesListCodes(notation, 1, 0),
  ]).then(([codesList, codes]) => ({
    codes: codes.items ?? [],
    ...codesList,
  }));
};
