import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Exporting, Loading } from "@components/loading";

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import { useCollections } from "../../../hooks/useCollections";
import { CollectionsToExport } from "./components/CollectionsToExport";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("collection.title"), t("common.exportTitle"));

  const { data: collectionsData = [], isLoading } = useCollections();

  // Seule instance de l'exporteur : c'est elle qui porte l'état de l'export (en cours, échec).
  const { mutate: exportCollection, isPending: isExporting, error } = useCollectionExporter();

  const collections = useMemo(
    () =>
      collectionsData.map((collection) => ({
        id: collection.id,
        label: collection.label?.value ?? "",
      })),
    [collectionsData],
  );

  if (isLoading) return <Loading />;

  // Le sélecteur reste monté pendant l'export : démonté, il perdrait la sélection, qu'un
  // échec doit laisser intacte.
  return (
    <>
      {isExporting && <Exporting />}
      <div hidden={isExporting}>
        <CollectionsToExport
          collections={collections}
          exportCollection={exportCollection}
          exportError={error}
        />
      </div>
    </>
  );
};
