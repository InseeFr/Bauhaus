import type { QueryClient } from "@tanstack/react-query";
import type {
  Category,
  Code,
  CodeList,
  CodeRepresentation,
  PhysicalInstanceResponse,
} from "../../types/api";
import { DDIApi } from "../../../../sdk";

export interface CodeListAndCategories {
  codeList?: CodeList;
  categories?: Category[];
}

export async function loadCodeListForVariable(
  queryClient: QueryClient,
  codeRepresentation: CodeRepresentation,
): Promise<CodeListAndCategories> {
  const ref = codeRepresentation.CodeListReference;
  const agency = ref?.Agency;
  const id = ref?.ID;
  if (!agency || !id) return {};

  const data: PhysicalInstanceResponse = await queryClient.fetchQuery({
    queryKey: ["codeListById", agency, id],
    queryFn: () => DDIApi.getMutualizedCodesList(agency, id),
  });

  const codeList = data?.CodeList?.find((cl) => cl.ID === id);
  if (!codeList?.Code) {
    return codeList ? { codeList } : {};
  }

  const categoryIds = new Set(
    codeList.Code.map((c: Code) => c.CategoryReference?.ID).filter((catId): catId is string =>
      Boolean(catId),
    ),
  );
  const categories = data?.Category?.filter((cat: Category) => categoryIds.has(cat.ID!));
  return { codeList, categories };
}
