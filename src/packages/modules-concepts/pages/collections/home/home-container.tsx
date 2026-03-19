import { Loading } from "@components/loading";

import CollectionsHome from "./home";
import { useCollections } from "../../../hooks/useCollections";

export const Component = () => {
  const { data: collections, isLoading } = useCollections();

  if (isLoading) {
    return <Loading />;
  }

  const formattedCollections = collections.map((c) => ({
    id: c.id,
    label: c.label.value,
  }));
  return <CollectionsHome collections={formattedCollections} />;
};
