import { Picker } from "@components/picker-page";

import { useCollectionExporter } from "@utils/hooks/collections";

import D from "../../../deprecated-locales/build-dictionary";
import ExportButtons from "../export-buttons";

interface CollectionItem {
  id: string;
  label: string;
}

interface CollectionsToExportProps {
  collections: CollectionItem[];
}

const CollectionsToExport = ({ collections }: Readonly<CollectionsToExportProps>) => {
  const { mutate: exportCollection } = useCollectionExporter();

  return (
    <Picker
      items={collections}
      title={D.exportTitle}
      panelTitle={D.collectionsExportPanelTitle}
      labelWarning={D.hasNotCollectionToExport}
      handleAction={() => {}}
      context="concepts/collections"
      ValidationButton={({ selectedIds }) => (
        <ExportButtons
          disabled={selectedIds.length < 1}
          exportHandler={(type: string, withConcepts: boolean, lang: "lg1" | "lg2" = "lg1") =>
            exportCollection({ ids: selectedIds, type, withConcepts, lang })
          }
        />
      )}
    />
  );
};

export default CollectionsToExport;
