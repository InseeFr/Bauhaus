import { useQuery } from "@tanstack/react-query";

import { CollectionApi as NewCollectionApi } from "@sdk/new-collection-api";

import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { MODULES, PRIVILEGES } from "@utils/hooks/users";

import {
  Collection,
  CollectionGeneral,
  CollectionMember,
  CollectionWithMembers,
} from "@model/concepts/collection";

import { useAuthorizationGuard } from "../../auth/components/auth";
import { emptyCollection } from "../utils/emptyCollection";

const transformCollection = (data: Collection, lg1 = "fr"): CollectionGeneral => {
  const lg2 = lg1.toLowerCase() === "fr" ? "en" : "fr";

  const prefLabelLg1 =
    data.labels?.find((label) => label.lang.toLowerCase() === lg1.toLowerCase())?.value ?? "";

  const prefLabelLg2 =
    data.labels?.find((label) => label.lang.toLowerCase() === lg2.toLowerCase())?.value ?? "";

  const descriptionLg1 =
    data.descriptions?.find((desc) => desc.lang.toLowerCase() === lg1.toLowerCase())?.value ?? "";

  const descriptionLg2 =
    data.descriptions?.find((desc) => desc.lang.toLowerCase() === lg2.toLowerCase())?.value ?? "";

  return {
    ...data,
    prefLabelLg1,
    prefLabelLg2,
    descriptionLg1,
    descriptionLg2,
  };
};

export const useCollection = (id: string | undefined) => {
  const isContributor = useAuthorizationGuard({
    module: MODULES.CONCEPT_COLLECTION,
    privilege: PRIVILEGES.CREATE,
  });
  const defaultContributor = useDefaultContributor(isContributor);

  return useQuery<CollectionWithMembers>({
    queryKey: ["collection", id],
    queryFn: async () => {
      const [general, members] = await Promise.all([
        NewCollectionApi.getCollectionById(id!),
        NewCollectionApi.getCollectionMembersList(id!),
      ]);
      return {
        general: transformCollection(general),
        members: members as CollectionMember[],
      };
    },
    enabled: !!id,
    placeholderData: id ? undefined : emptyCollection(defaultContributor),
  });
};
