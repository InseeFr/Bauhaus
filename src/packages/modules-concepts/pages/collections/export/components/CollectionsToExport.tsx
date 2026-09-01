import { useTranslation } from "react-i18next";

import { Picker } from "@components/picker-page";

import { useCollectionExporter } from "@utils/hooks/collections";

import { CollectionExportFormat } from "@model/concepts/collection";

import { ExportButtons } from "../../../../components/ExportButtons";

interface CollectionItem {
  id: string;
  label: string;
}

interface CollectionsToExportProps {
  collections: CollectionItem[];
}

export const CollectionsToExport = ({ collections }: Readonly<CollectionsToExportProps>) => {
  const { t } = useTranslation();

  const { mutate: exportCollection } = useCollectionExporter();

  return (
    <Picker
      items={collections}
      title={t("common.exportTitle")}
      panelTitle={(size) => t("collection.export.panelTitle", { size })}
      availablePanelTitle={(size) => t("collection.export.availablePanelTitle", { size })}
      labelWarning={t("collection.export.hasNot")}
      handleAction={() => {}}
      context="concepts/collections"
      ValidationButton={({ selectedIds }) => (
        <ExportButtons
          disabled={selectedIds.length < 1}
          exportHandler={(
            type: CollectionExportFormat,
            withConcepts: boolean,
            lang: "lg1" | "lg2" = "lg1",
          ) => exportCollection({ ids: selectedIds, type, withConcepts, lang })}
        />
      )}
    />
  );
};
