import { Exporting, Loading } from "@components/loading";
import { Picker } from "@components/picker-page";

import D from "../../deprecated-locales";
import { useConceptExporter, useConcepts } from "../../utils/hooks/concepts";
import { useTitle } from "../../utils/hooks/useTitle";
import ExportButtons from "../collections/export-buttons";

export const Component = () => {
  useTitle(D.conceptsTitle, D.exportTitle);

  const { mutate: exportConcept, isPending: isExporting } =
    useConceptExporter();
  const { isLoading, data: concepts } = useConcepts();

  if (isExporting) {
    return <Exporting />;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Picker
      items={concepts}
      title={D.exportTitle}
      panelTitle={D.conceptsExportPanelTitle}
      labelWarning={D.hasNotConceptToExport}
      handleAction={() => {}}
      context="concepts"
      ValidationButton={({ selectedIds }) => (
        <ExportButtons
          exportHandler={(type, withConcepts, lang = "lg1") =>
            exportConcept({ ids: selectedIds, type, withConcepts, lang })
          }
          disabled={selectedIds.length < 1}
        />
      )}
    />
  );
};
