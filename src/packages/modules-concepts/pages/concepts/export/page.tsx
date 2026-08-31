import { useTranslation } from "react-i18next";

import { Exporting, Loading } from "@components/loading";
import { Picker } from "@components/picker-page";

import { useConceptExporter } from "../../../hooks/useConceptExporter";
import { useTitle } from "../../../../utils/hooks/useTitle";
import { ExportButtons } from "../../../components/ExportButtons";
import { useConcepts } from "../../../hooks/useConcepts";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("concept.title"), t("common.exportTitle"));

  const { mutate: exportConcept, isPending: isExporting } = useConceptExporter();
  const { isLoading, concepts } = useConcepts();

  if (isExporting) {
    return <Exporting />;
  }
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Picker
      items={concepts}
      title={t("common.exportTitle")}
      panelTitle={(size) => t("concept.export.panelTitle", { size })}
      availablePanelTitle={(size) => t("concept.export.availablePanelTitle", { size })}
      labelWarning={t("concept.export.hasNot")}
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
