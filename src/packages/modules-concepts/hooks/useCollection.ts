import { useQuery } from "@tanstack/react-query";
import { CollectionApi as NewCollectionApi } from "@sdk/new-collection-api";
import emptyCollection from "../collections/utils/empty-collection";
import { useAppContext } from "../../application/app-context";
import { Collection } from "@model/concepts/collection";

const transformCollection = (data, lg1 = "fr") => {
  const lg2 = lg1.toLowerCase() === "fr" ? "en" : "fr";

  const prefLabelLg1 =
    data.labels?.find((label) => label.lang.toLowerCase() === lg1.toLowerCase())?.value || "";

  const prefLabelLg2 =
    data.labels?.find((label) => label.lang.toLowerCase() === lg2.toLowerCase())?.value || "";

  const descriptionLg1 =
    data.descriptions?.find((desc) => desc.lang.toLowerCase() === lg1.toLowerCase())?.value || "";

  const descriptionLg2 =
    data.descriptions?.find((desc) => desc.lang.toLowerCase() === lg2.toLowerCase())?.value || "";

  return {
    ...data,
    prefLabelLg1,
    prefLabelLg2,
    descriptionLg1,
    descriptionLg2,
  };
};

export const useCollection = (id: string | undefined) => {
  const {
    properties: { defaultContributor },
  } = useAppContext();

  return useQuery({
    queryKey: ["collection", id],
    queryFn: async () => {
      const [general, members] = await Promise.all([
        NewCollectionApi.getCollectionById(id),
        NewCollectionApi.getCollectionMembersList(id),
      ]);

      const transformedGeneral = transformCollection(general);

      return {
        general: transformedGeneral,
        members,
      };
    },
    enabled: !!id,
    placeholderData: id
      ? undefined
      : (emptyCollection(defaultContributor) as unknown as Collection),
  });
};
