import { useQuery } from "@tanstack/react-query";

import { CodeListApi } from "@sdk/index";

const CL_SOURCE_CATEGORY = "CL_SOURCE_CATEGORY";
const CL_FREQ = "CL_FREQ";

const defaultCodesLists = {
  [CL_SOURCE_CATEGORY]: { codes: [] },
  [CL_FREQ]: { codes: [] },
};

const fetchCodeList = async (notation: string) => {
  const [codesList, codes] = await Promise.all([
    CodeListApi.getCodesList(notation),
    CodeListApi.getCodesListCodes(notation, 1, 0),
  ]);

  return {
    codes: codes.items ?? [],
    ...codesList,
  };
};

export const useCodesLists = () => {
  const { isLoading, data: codesLists = defaultCodesLists } = useQuery({
    queryKey: ["operations-codes-lists"],
    queryFn: async () => {
      const notations = [CL_SOURCE_CATEGORY, CL_FREQ];
      const results = await Promise.all(notations.map(fetchCodeList));

      return results.reduce(
        (acc, codeList) => ({
          ...acc,
          [codeList.notation]: codeList,
        }),
        defaultCodesLists,
      );
    },
  });

  return { isLoading, codesLists };
};
