import { useState } from "react";

import { Exporting, Loading } from "@components/loading";
import { Picker } from "@components/picker-page";

import D from "../../deprecated-locales";
import { useConceptExporter, useConcepts } from "../../utils/hooks/concepts";
import { useTitle } from "../../utils/hooks/useTitle";
import ExportButtons from "../collections/export-buttons";

export const Component = () => {
  useTitle(D.conceptsTitle, D.exportTitle);
  const [ids, setIds] = useState<string[]>([]);

  const { mutate: exportConcept, isPending: isExporting } = useConceptExporter();
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
      handleAction={(value: string[]) => setIds(value)}
      context="concepts"
      disabled={ids.length < 1}
      disabledWarningMessage={D.hasNotConceptToExport}
      ValidationButton={() => (
        <ExportButtons
          exportHandler={(type, withConcepts, lang = "lg1") =>
            exportConcept({ ids, type, withConcepts, lang })
          }
          disabled={ids.length < 1}
        />
      )}
    />
  );
};
