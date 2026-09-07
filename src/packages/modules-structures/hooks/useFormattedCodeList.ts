import { useQuery } from "@tanstack/react-query";

import { CodelistsApi } from "@sdk/codelists-api";
import { sortArray } from "@utils/array-utils";

import { CodesLists } from "../../model/CodesList";

const sortByLabel = sortArray("labelLg1");

export const useFormattedCodeList = () =>
  useQuery<CodesLists>({
    queryKey: ["formattedCodeList"],
    queryFn: () =>
      Promise.all([CodelistsApi.getCodelists(), CodelistsApi.getCodelistsPartial()]).then(
        ([codelists, partialCodelists]) =>
          sortByLabel([...codelists, ...partialCodelists]).map(({ uri, labelLg1, id }: any) => ({
            id: uri,
            label: labelLg1,
            notation: id,
          })),
      ),
  });
