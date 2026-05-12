import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Exporting, Loading } from "@components/loading";

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import { useCollections } from "../../../hooks/useCollections";
import CollectionsToExport from "./components/home";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("collection.title"), t("common.exportTitle"));

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
