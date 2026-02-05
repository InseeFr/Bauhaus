import { useMemo } from "react";

import { Exporting, Loading } from "@components/loading";

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales/build-dictionary";
import { useCollections } from "../../hooks/useCollections";
import CollectionsToExport from "./home";

export const Component = () => {
  useTitle(D.collectionsTitle, D.exportTitle);

  const { data: collectionsData = [], isLoading } = useCollections();
  const { isPending: isExporting } = useCollectionExporter();

  const collections = useMemo(
    () =>
      collectionsData.map((collection) => ({
        id: collection.id,
        label: collection.label?.value ?? "",
      })),
    [collectionsData],
  );

  if (isExporting) return <Exporting />;
  if (isLoading) return <Loading />;

  return <CollectionsToExport collections={collections} />;
};
